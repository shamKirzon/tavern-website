import React, { useEffect, useState } from "react";
import { Plus, Eye, EyeOff, X, Search } from "lucide-react";
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

const ROLE_FILTERS = ["All", "Manager", "Server", "Cashier", "Security Guard"];
const EMPLOYEE_TYPES = ["Manager", "Server", "Cashier", "Security Guard"];
const ROLE_ORDER = ["MANAGER", "SERVER", "CASHIER", "SECURITY GUARD"];

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

const Backdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 40,
      backdropFilter: "blur(6px)",
      backgroundColor: "rgba(0,0,0,0.45)",
    }}
  />
);

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  mode?: "add" | "edit" | "delete";
}> = ({ title, onClose, children, mode }) => (
  <>
    <Backdrop onClick={onClose} />
    <div
      style={{
        position: "fixed",
        zIndex: 50,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 440,
        maxWidth: "95vw",
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(to right, #AA3131, #AA3131, #770B0B)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* IconCoPresent for Add modal, IconEngineering for Edit modal */}
          {mode === "add" && <IconCoPresent className="" />}
          {mode === "edit" && <IconEngineering className="" />}
          <h2
            style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}
          >
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </div>
  </>
);

interface EmployeeFormModalProps {
  mode: "add" | "edit";
  employee?: Employee | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  mode,
  employee,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(employee?.fullName ?? "");
  const [type, setType] = useState(
    employee
      ? employee.employeeRole.charAt(0).toUpperCase() +
          employee.employeeRole.slice(1).toLowerCase()
      : "",
  );

  const matchTime = (t?: string) => {
    if (!t) return TIME_OPTIONS[0];
    return TIME_OPTIONS.find((o) => o === t.trim()) ?? TIME_OPTIONS[0];
  };

  const [shiftStart, setShiftStart] = useState(matchTime(employee?.shiftStart));
  const [shiftEnd, setShiftEnd] = useState(matchTime(employee?.shiftEnd));
  const [days, setDays] = useState<string[]>(
    (employee?.shiftDay ?? []).map(normalizeDay),
  );
  const [pin, setPin] = useState(employee?.pin ?? "");
  const [showPin, setShowPin] = useState(false);

  const toggleDay = (day: string) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const handleSave = () => {
    onSave({
      fullName: name,
      employeeRole: type.toUpperCase(),
      shiftStart,
      shiftEnd,
      shiftDay: days,
      pin,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #d1d5db",
    borderRadius: 12,
    padding: "9px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#AA3131",
    marginBottom: 6,
  };

  return (
    <Modal
      title={mode === "add" ? "Add Employee" : "Edit Employee"}
      onClose={onClose}
      mode={mode}
    >
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <label style={labelStyle}>
            <IconCoPresent />
            Employee Name
          </label>
          <input
            style={inputStyle}
            placeholder="e.g. Maria Leonora"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span style={{ ...labelStyle, marginBottom: 0, flex: 1 }}>
              <IconEngineering />
              Employee Type
            </span>
            <span
              style={{
                ...labelStyle,
                marginBottom: 0,
                width: 105,
                justifyContent: "center",
              }}
            >
              Start
            </span>
            <span
              style={{
                ...labelStyle,
                marginBottom: 0,
                width: 105,
                justifyContent: "center",
              }}
            >
              End
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">Select Type</option>
                {EMPLOYEE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={shiftStart}
              onChange={(e) => setShiftStart(e.target.value)}
              style={{ ...inputStyle, width: 105 }}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={shiftEnd}
              onChange={(e) => setShiftEnd(e.target.value)}
              style={{ ...inputStyle, width: 105 }}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Shift Days</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DAY_KEYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1.5px solid",
                  fontFamily: "sans-serif",
                  borderColor: days.includes(day) ? "#AA3131" : "#d1d5db",
                  background: days.includes(day) ? "#AA3131" : "#fff",
                  color: days.includes(day) ? "#fff" : "#333",
                  transition: "all 0.15s",
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {mode === "edit" && (
          <div>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#888",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 6,
              }}
            >
              Security PIN
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                placeholder="••••••"
                style={{ ...inputStyle, paddingRight: 40, letterSpacing: 4 }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPin ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 12,
              background: "#EFD974",
              color: "#111",
              border: "none",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "sans-serif",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface DeleteModalProps {
  employee: Employee;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  employee,
  onClose,
  onConfirm,
}) => (
  <Modal title="Remove Employee" onClose={onClose}>
    <div style={{ padding: "24px" }}>
      <p
        style={{
          fontSize: 14,
          color: "#444",
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        Are you sure you want to remove <strong>{employee.fullName}</strong> (
        {employee.employeeRole.charAt(0).toUpperCase() +
          employee.employeeRole.slice(1).toLowerCase()}
        )? This cannot be undone.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            background: "#111",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            background: "#EFD974",
            color: "#111",
            border: "none",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Yes, Remove
        </button>
      </div>
    </div>
  </Modal>
);

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
  const isManager = employee.employeeRole.toUpperCase() === "MANAGER";
  const roleLabel =
    employee.employeeRole.charAt(0).toUpperCase() +
    employee.employeeRole.slice(1).toLowerCase();
  const normalizedDays = (employee.shiftDay ?? []).map(normalizeDay);

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #111",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {getInitials(employee.fullName)}
          </div>
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                margin: 0,
                color: "#111",
              }}
            >
              {employee.fullName}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "2px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: isManager ? "#EFD974" : "#AA3131",
                color: isManager ? "#111" : "#fff",
              }}
            >
              {roleLabel}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(employee)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#111",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(employee)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#111",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconDelete />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#555",
        }}
      >
        <IconSchedule />
        <span>Shift</span>
        <span style={{ fontWeight: 600 }}>
          {employee.shiftStart} – {employee.shiftEnd}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#555",
          flexWrap: "wrap",
        }}
      >
        <IconCalendar />
        <span>Days</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {normalizedDays.map((day) => (
            <span
              key={day}
              style={{
                padding: "2px 7px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                background: "#AA3131",
                color: "#fff",
              }}
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#555",
        }}
      >
        <IconLock />
        <span>PIN</span>
        <span
          style={{ letterSpacing: 3, color: "#999", fontFamily: "monospace" }}
        >
          {showPin ? employee.pin : "••••••"}
        </span>
        <button
          onClick={() => setShowPin(!showPin)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            color: "#AA3131",
            textDecoration: "underline",
            padding: 0,
            fontFamily: "sans-serif",
          }}
        >
          {showPin ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

const EmployeeManagement: React.FC = () => {
  const currentDate = new Date();
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

  const handleAddEmployee = (data: Partial<Employee>) => {
    const newEmp: Employee = {
      employeeId: Date.now().toString(),
      fullName: data.fullName ?? "",
      employeeRole: data.employeeRole ?? "CASHIER",
      shiftStart: data.shiftStart ?? "",
      shiftEnd: data.shiftEnd ?? "",
      shiftDay: data.shiftDay ?? [],
      pin: data.pin ?? "",
      imageUrl: null,
    };
    setEmployeeList((prev) => [...prev, newEmp]);
  };

  const handleEditEmployee = (data: Partial<Employee>) => {
    if (!editEmployee) return;
    setEmployeeList((prev) =>
      prev.map((e) =>
        e.employeeId === editEmployee.employeeId ? { ...e, ...data } : e,
      ),
    );
  };

  const handleDeleteEmployee = () => {
    if (!deleteEmployee) return;
    setEmployeeList((prev) =>
      prev.filter((e) => e.employeeId !== deleteEmployee.employeeId),
    );
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
    <div>
      {/* ── BANNER: left-to-right gradient + drop shadow ── */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(to right, #AA3131, #AA3131, #770B0B)",
          borderRadius: 16,
          boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* ── IconGroup in banner ── */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconGroup />
          </div>
          <div>
            <h1
              style={{
                color: "#fff",
                fontSize: 36,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Employees
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 16,
                margin: 0,
              }}
            >
              {formatReadableDate(currentDate)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            borderRadius: 12,
            background: "#EFD974",
            color: "#111",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Header */}
      <div
        className="flex flex-row  pl-7 items-center w-full h-[100px] rounded-2xl  justify-between font-poppins"
        style={{
          background: "linear-gradient(to right, #AA3131, #770B0B)",
          boxShadow: "0 8px 32px rgba(150,30,30,0.45)",
        }}
      >
        <div className="flex">
          <div className="w-[60px] h-[60px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <IconGroup />
          </div>
          <div className="ml-5 text-white">
            <h1 className="font-poppins text-[38px] font-bold leading-tight">
              Reservations
            </h1>
            <p className="font-poppins text-[13px] mt-0.5 opacity-85">
              {formatReadableDate(new Date())}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            borderRadius: 12,
            background: "#EFD974",
            color: "#111",
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 260 }}>
          <Search
            size={15}
            color="#aaa"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            placeholder="Search by name or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              border: "1.5px solid #d1d5db",
              borderRadius: 12,
              padding: "10px 14px 10px 36px",
              fontSize: 13,
              outline: "none",
              background: "#fff",
              boxSizing: "border-box",
              fontFamily: "sans-serif",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: filter === role ? "#AA3131" : "transparent",
                color: filter === role ? "#fff" : "#555",
                transition: "all 0.15s",
                fontFamily: "sans-serif",
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {filteredAndSorted.map((employee) => (
          <EmployeeCard
            key={employee.employeeId}
            employee={employee}
            onEdit={(emp) => setEditEmployee(emp)}
            onDelete={(emp) => setDeleteEmployee(emp)}
          />
        ))}
      </div>

      {showAddModal && (
        <EmployeeFormModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}
      {editEmployee && (
        <EmployeeFormModal
          mode="edit"
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSave={handleEditEmployee}
        />
      )}
      {deleteEmployee && (
        <DeleteModal
          employee={deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
