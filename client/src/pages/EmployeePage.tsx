import React, { useEffect, useState } from "react";
import { Plus, Eye, EyeOff, Search, ChevronDown } from "lucide-react";
import { employeesApi } from "@/api/employees.api";
import type { Employee } from "@/types/Employee";
import { formatReadableDate } from "@/utils/date";
import {
  IconGroup,
  IconDelete,
  IconEdit,
  IconLock,
  IconSchedule,
  IconCalendar,
  IconCoPresent,
  IconEngineering,
} from "@/assets/icons/icons";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { capitalizeWords } from "@/utils/capitalizeWords";

// ── Constants ──────────────────────────────────────────────────────────────────
const ROLE_FILTERS = [
  "All",
  "Bartender",
  "Waiter",
  "Kitchen Staff",
  "Cashier",
  "Security",
];
const EMPLOYEE_TYPES = [
  "Bartender",
  "Waiter",
  "Kitchen Staff",
  "Cashier",
  "Security",
];
const ROLE_ORDER = [
  "BARTENDER",
  "WAITER",
  "KITCHEN STAFF",
  "CASHIER",
  "SECURITY",
];
const ROLES_WITH_PIN = ["CASHIER", "SECURITY"];
const DAY_KEYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DAY_ALIASES: Record<string, string> = {
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
  SUN: "SUN",
  MONDAY: "MON",
  TUESDAY: "TUE",
  WEDNESDAY: "WED",
  THURSDAY: "THU",
  FRIDAY: "FRI",
  SATURDAY: "SAT",
  SUNDAY: "SUN",
};

const normalizeDay = (d: string): string =>
  DAY_ALIASES[d.trim().toUpperCase()] ?? d.trim().toUpperCase();

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (const m of [0, 30]) {
    const suffix = h < 12 ? "AM" : "PM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const mm = String(m).padStart(2, "0");
    TIME_OPTIONS.push(`${displayH}:${mm} ${suffix}`);
  }
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const roleHasPin = (role: string) =>
  ROLES_WITH_PIN.includes(role.toUpperCase());

// ── Shared modal header ────────────────────────────────────────────────────────
const ModalHeader: React.FC<{
  title: string;
  mode?: "add" | "edit" | "delete";
}> = ({ title, mode }) => (
  <div
    className="px-6 py-5 flex items-center gap-3"
    style={{ background: "linear-gradient(to right, #AA3131, #770B0B)" }}
  >
    {mode === "add" && <IconCoPresent />}
    {mode === "edit" && <IconEngineering />}
    <h2 className="text-white text-xl font-bold">{title}</h2>
  </div>
);

// ── Employee Form Modal ───────────────────────────────────────────────────────
interface EmployeeFormModalProps {
  open: boolean;
  mode: "add" | "edit";
  employee?: Employee | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  open,
  mode,
  employee,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(employee?.fullName ?? "");
  const [type, setType] = useState(
    employee ? capitalizeWords(employee.employeeRole) : "",
  );

  const matchTime = (t?: string) => {
    if (!t) return "";
    const trimmed = t.trim().toUpperCase();
    // Normalize "08:00 AM" to "8:00 AM" for matching if needed
    return (
      TIME_OPTIONS.find((o) => o.toUpperCase() === trimmed) ??
      TIME_OPTIONS.find((o) => {
        const [time, suffix] = o.split(" ");
        const [h, m] = time.split(":");
        const normalized = `${parseInt(h)}:${m} ${suffix}`;
        return normalized.toUpperCase() === trimmed;
      }) ??
      ""
    );
  };

  const [shiftStart, setShiftStart] = useState(matchTime(employee?.shiftStart));
  const [shiftEnd, setShiftEnd] = useState(matchTime(employee?.shiftEnd));
  const [days, setDays] = useState<string[]>(
    (employee?.shiftDay ?? []).map(normalizeDay),
  );
  const [pin, setPin] = useState(employee?.pin ?? "");
  const [showPin, setShowPin] = useState(false);

  // ── Validation errors ──
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const needsPin = roleHasPin(type);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Employee name is required.";
    if (!type) e.type = "Employee type is required.";
    if (!shiftStart) e.shiftStart = "Start time is required.";
    if (!shiftEnd) e.shiftEnd = "End time is required.";
    if (days.length === 0) e.days = "Select at least one shift day.";
    if (needsPin) {
      if (!pin) e.pin = "PIN is required.";
      else if (pin.length !== 5) e.pin = "PIN must be exactly 5 digits.";
    }
    return e;
  };

  const toggleDay = (day: string) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const handleSave = () => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSave({
      fullName: name,
      employeeRole: type.toLowerCase(),
      shiftStart,
      shiftEnd,
      shiftDay: days,
      pin: needsPin ? pin : "",
    });

    onClose();
  };

  // Re-validate on every change after first submit attempt
  useEffect(() => {
    if (submitted) setErrors(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, type, shiftStart, shiftEnd, days, pin, submitted]);

  // Border helper: red if error, normal otherwise
  const fieldBorder = (key: string) =>
    errors[key]
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-[#AA3131]";

  const labelCls =
    "flex items-center gap-1.5 text-xs font-medium text-[#AA3131] uppercase tracking-wide mb-2";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      {/* <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" /> */}
      <DialogContent
        showCloseButton={true}
        className="fixed top-1/2 left-1/2 w-[440px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl overflow-hidden shadow-2xl p-0 gap-0 border-none"
      >
        <ModalHeader
          title={mode === "add" ? "Add Employee" : "Edit Employee"}
          mode={mode}
        />

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Employee Name */}
          <div>
            <label className={labelCls}>
              <IconCoPresent />
              Employee Name
            </label>
            <input
              className={`w-full border-[1.5px] rounded-xl px-4 py-2.5 text-sm outline-none bg-white font-sans transition ${fieldBorder("name")}`}
              placeholder="e.g. Maria Leonora"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Employee Type + Shift Time */}
          <div>
            <div className="flex gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#AA3131] uppercase tracking-wide flex-1">
                <IconEngineering />
                Employee Type
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wide w-[105px] text-center ${errors.shiftStart ? "text-red-500" : "text-[#AA3131]"}`}
              >
                Start
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wide w-[105px] text-center ${errors.shiftEnd ? "text-red-500" : "text-[#AA3131]"}`}
              >
                End
              </span>
            </div>

            <div className="flex gap-2">
              {/* Type dropdown */}
              <div className="flex-1 relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full border-[1.5px] rounded-xl px-4 py-2.5 text-sm outline-none bg-white appearance-none font-sans transition pr-8 ${fieldBorder("type")}`}
                >
                  <option value="">Select Type</option>
                  {EMPLOYEE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Shift Start */}
              <select
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className={`w-[105px] border-[1.5px] rounded-xl px-2 py-2.5 text-sm outline-none bg-white font-sans transition text-center ${fieldBorder("shiftStart")}`}
              >
                <option value="">--:-- --</option>
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Shift End */}
              <select
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className={`w-[105px] border-[1.5px] rounded-xl px-2 py-2.5 text-sm outline-none bg-white font-sans transition text-center ${fieldBorder("shiftEnd")}`}
              >
                <option value="">--:-- --</option>
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Inline errors for type / shift times */}
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type}</p>
                )}
              </div>
              <div className="w-[105px]">
                {errors.shiftStart && (
                  <p className="text-red-500 text-xs">{errors.shiftStart}</p>
                )}
              </div>
              <div className="w-[105px]">
                {errors.shiftEnd && (
                  <p className="text-red-500 text-xs">{errors.shiftEnd}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shift Days */}
          <div>
            <label
              className={`${labelCls} ${errors.days ? "text-red-500" : ""}`}
            >
              Shift
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAY_KEYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border-[1.5px] transition-all cursor-pointer font-sans ${
                    days.includes(day)
                      ? "bg-[#AA3131] border-[#AA3131] text-white"
                      : errors.days
                        ? "bg-white border-red-400 text-gray-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.days && (
              <p className="text-red-500 text-xs mt-1">{errors.days}</p>
            )}
          </div>

          {/* Security PIN — only for Cashier & Security Guard */}
          {needsPin && (
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                Security PIN
              </label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => {
                    // Allow digits only, max 5
                    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setPin(val);
                  }}
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="•••••"
                  className={`w-full border-[1.5px] rounded-xl px-4 py-2.5 text-sm outline-none bg-white pr-10 tracking-[6px] font-sans transition ${fieldBorder("pin")}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer flex items-center p-0"
                >
                  {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.pin && (
                <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#111] text-white font-semibold text-sm cursor-pointer font-sans hover:bg-gray-900 transition border-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-[#EFD974] text-[#111] font-semibold text-sm cursor-pointer font-sans hover:bg-yellow-300 transition border-none"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────
interface DeleteModalProps {
  open: boolean;
  employee: Employee;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  employee,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    {/* <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" /> */}
    <DialogContent
      showCloseButton={true}
      className="fixed top-1/2 left-1/2 w-[440px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl overflow-hidden shadow-2xl p-0 gap-0 border-none"
    >
      <ModalHeader title="Remove Employee" mode="delete" />
      <div className="px-6 py-6">
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Are you sure you want to remove <strong>{employee.fullName}</strong> (
          {employee.employeeRole.charAt(0).toUpperCase() +
            employee.employeeRole.slice(1).toLowerCase()}
          )? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-[#111] text-white font-semibold text-sm cursor-pointer font-sans hover:bg-gray-900 transition border-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-[#EFD974] text-[#111] font-semibold text-sm cursor-pointer font-sans hover:bg-yellow-300 transition border-none"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// ── Employee Card ─────────────────────────────────────────────────────────────
interface EmployeeCardProps {
  employee: Employee;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  const [showPin, setShowPin] = useState(false);
  const roleLabel =
    employee.employeeRole.charAt(0).toUpperCase() +
    employee.employeeRole.slice(1).toLowerCase();
  const normalizedDays = (employee.shiftDay ?? []).map(normalizeDay);
  const hasPinRole = roleHasPin(employee.employeeRole);

  const badgeCls = ["WAITER", "BARTENDER"].includes(
    employee.employeeRole.toUpperCase(),
  )
    ? "bg-[#EFD974] text-[#111]"
    : "bg-[#AA3131] text-white";

  return (
    <div className="bg-white border-[1.5px] border-[#111] rounded-2xl p-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="w-15 h-15 rounded-xl bg-[#555] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {getInitials(employee.fullName)}
          </div>
          <div>
            <p className="font-medium text-lg text-[#111] leading-tight">
              {employee.fullName}
            </p>
            <span
              className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${badgeCls}`}
            >
              {roleLabel}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mr-5">
          <button
            onClick={() => onEdit(employee)}
            className="w-9 h-9 rounded-lg bg-[#111] flex items-center justify-center hover:bg-gray-800 transition cursor-pointer border-none"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="w-9 h-9 rounded-lg bg-[#111] flex items-center justify-center hover:bg-gray-800 transition cursor-pointer border-none"
          >
            <IconDelete />
          </button>
        </div>
      </div>

      <div className="border-t  border border-gray-100 w-full" />

      {/* Shift time */}
      <div className="flex items-center gap-2 text-xs text-[#555]">
        <IconSchedule />
        <span>Shift</span>
        <span className="font-medium">
          {employee.shiftStart} – {employee.shiftEnd}
        </span>
      </div>

      {/* Shift days */}
      <div className="flex items-center gap-2 text-xs text-[#555] flex-wrap">
        <IconCalendar />
        <span>Days</span>
        <div className="flex gap-1 flex-wrap">
          {normalizedDays.map((day) => (
            <span
              key={day}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#AA3131] text-white"
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      {/* PIN — only Cashier & Security Guard */}
      {hasPinRole && (
        <div className="flex items-center gap-2 text-xs text-[#555]">
          <IconLock />
          <span>PIN</span>
          <span className="tracking-[3px] text-[#999] font-mono">
            {showPin ? employee.pin : "•••••"}
          </span>
          <button
            onClick={() => setShowPin(!showPin)}
            className="text-[#AA3131] underline text-xs bg-transparent border-none cursor-pointer p-0 font-sans"
          >
            {showPin ? "Hide" : "Show"}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const EmployeeManagement: React.FC = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const lists = await employeesApi.getEmployeeList();
      if (lists) setEmployeeList(lists);
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (data: Partial<Employee>) => {
    const newEmp = await employeesApi.addEmployee(data);
    if (newEmp) {
      setEmployeeList((prev) => [...prev, newEmp]);
    }
  };

  const handleEditEmployee = async (data: Partial<Employee>) => {
    if (!editEmployee) return;
    const updated = await employeesApi.updateEmployee(
      editEmployee.employeeId,
      data,
    );
    if (updated) {
      setEmployeeList((prev) =>
        prev.map((e) =>
          e.employeeId === editEmployee.employeeId ? { ...e, ...updated } : e,
        ),
      );
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deleteEmployee) return;
    const success = await employeesApi.deleteEmployee(
      deleteEmployee.employeeId,
    );
    if (success) {
      setEmployeeList((prev) =>
        prev.filter((e) => e.employeeId !== deleteEmployee.employeeId),
      );
    }
  };

  const filteredAndSorted = employeeList
    .filter((e) => {
      const matchesFilter =
        filter === "All" ||
        e.employeeRole.toUpperCase().includes(filter.toUpperCase()) ||
        filter.toUpperCase().includes(e.employeeRole.toUpperCase());
      const matchesSearch =
        search === "" ||
        e.fullName.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeRole.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort(
      (a, b) =>
        (ROLE_ORDER.indexOf(a.employeeRole.toUpperCase()) ?? 99) -
        (ROLE_ORDER.indexOf(b.employeeRole.toUpperCase()) ?? 99),
    );

  return (
    <div className="font-poppins">
      {/* ── Header Banner ── */}
      <div
        className="w-full rounded-2xl px-6 py-4 flex items-center justify-between mb-6"
        style={{
          background: "linear-gradient(to right, #AA3131, #770B0B)",
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <IconGroup className="text-white" />
          </div>
          <div className="text-white">
            <h1 className="font-poppins text-[36px] font-bold leading-tight">
              Employees
            </h1>
            <p className="text-sm opacity-75 mt-0.5">
              {formatReadableDate(new Date())}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EFD974] text-[#111] font-semibold text-sm cursor-pointer font-sans hover:bg-yellow-300 transition border-none"
        >
          <Plus size={15} />
          Add Employee
        </button>
      </div>

      {/* ── Filters Row ── */}
      <div className="grid grid-cols-2 gap-4 mb-5 items-center">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-[1.5px] border-gray-300 rounded-2xl py-2.5 pl-9 pr-4 text-sm outline-none bg-white font-sans focus:border-[#AA3131] transition"
          />
        </div>

        <div className="flex gap-1 flex-wrap bg-white rounded-xl border border-gray-200 px-2 py-1.5 shadow-sm justify-center">
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer border-none transition font-sans ${
                filter === role
                  ? "bg-[#AA3131] text-white"
                  : "bg-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ── Employee Cards Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {filteredAndSorted.map((employee) => (
          <EmployeeCard
            key={employee.employeeId}
            employee={employee}
            onEdit={(emp) => setEditEmployee(emp)}
            onDelete={(emp) => setDeleteEmployee(emp)}
          />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center text-gray-400 py-20 text-sm">
          No employees found.
        </div>
      )}

      {/* ── Add Modal ── */}
      <EmployeeFormModal
        open={showAddModal}
        mode="add"
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEmployee}
      />

      {/* ── Edit Modal ── */}
      {editEmployee && (
        <EmployeeFormModal
          open={!!editEmployee}
          mode="edit"
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSave={handleEditEmployee}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteEmployee && (
        <DeleteModal
          open={!!deleteEmployee}
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
