"use client";

interface Props {
  role: string;
  mission: string;
  audience: string;
  onChange: (patch: { role?: string; mission?: string; audience?: string }) => void;
}

const FIELDS: {
  key: "role" | "mission" | "audience";
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    key: "role",
    label: "Role",
    hint: "Who is this agent?",
    placeholder: 'e.g. "AI asistent gradonačelnika"',
  },
  {
    key: "mission",
    label: "Mission",
    hint: "What is its goal?",
    placeholder: 'e.g. "Pomaže građanima da razumeju procedure, nadležnosti i korake"',
  },
  {
    key: "audience",
    label: "Audience",
    hint: "Who does it address?",
    placeholder: 'e.g. "Građanima bez pravnog i administrativnog znanja"',
  },
];

export default function StructuredIdentity({ role, mission, audience, onChange }: Props) {
  const values = { role, mission, audience };

  return (
    <div className="space-y-4">
      {FIELDS.map((field) => {
        const val = values[field.key];
        return (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
                {field.label}
                <span className="ml-2 text-xs font-normal text-[#A3A3A3] dark:text-[#7A9BBF]">
                  {field.hint}
                </span>
              </label>
              {val.trim().length > 0 && (
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Set
                </span>
              )}
            </div>
            <input
              type="text"
              value={val}
              onChange={(e) => onChange({ [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] hover:border-gray-300 dark:hover:border-[#1E3050] placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] text-[#262626] dark:text-[#C8D8EE] transition-all"
            />
          </div>
        );
      })}
    </div>
  );
}
