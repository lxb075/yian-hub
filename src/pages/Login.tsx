import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Briefcase, HeartPulse, Stethoscope, Users, Sparkles, ArrowRight, ShieldCheck, Activity, Cpu, Heart } from "lucide-react";
import { useHub } from "@/store/hub";
import type { Role } from "@/types";
import { cn } from "@/lib/utils";

const roles: { id: Role; name: string; desc: string; icon: React.ComponentType<{ className?: string }>; chip: string }[] = [
  {
    id: "admin",
    name: "机构管理员",
    desc: "全模块访问 · 人员/设备/报表 · 系统设置",
    icon: Briefcase,
    chip: "from-moss-700 to-moss-500",
  },
  {
    id: "nurse",
    name: "责任护士",
    desc: "实时监护 · 告警处置 · 巡房与用药任务",
    icon: HeartPulse,
    chip: "from-safe to-moss-400",
  },
  {
    id: "doctor",
    name: "值班医生",
    desc: "健康监测 · 告警复核 · 医嘱与健康报告",
    icon: Stethoscope,
    chip: "from-sand-400 to-sand-600",
  },
  {
    id: "family",
    name: "家属",
    desc: "长者健康概览 · 日报与视频探视预约",
    icon: Users,
    chip: "from-info to-moss-400",
  },
];

export default function Login() {
  const nav = useNavigate();
  const login = useHub((s) => s.login);
  const [picked, setPicked] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const onEnter = (role: Role) => {
    setPicked(role);
    setLoading(true);
    setTimeout(() => {
      login(role);
      nav("/dashboard");
    }, 650);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col w-[44%] relative overflow-hidden border-r border-ink-100/60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(900px 600px at 10% 10%, rgba(200,164,92,0.18), transparent 60%), radial-gradient(700px 500px at 90% 90%, rgba(47,74,58,0.30), transparent 60%)",
          }}
        />
        <div className="relative z-10 p-12 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-moss-700 text-sand-50 flex items-center justify-center shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-[26px] font-semibold text-ink-600 leading-none">颐安云 Hub</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-400 mt-1">YianHub · Smart Eldercare</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg stagger">
            <div className="text-[12px] uppercase tracking-[0.22em] text-moss-700 font-medium mb-4">
              监护从被动到主动
            </div>
            <h1 className="font-display text-[58px] leading-[1.05] text-ink-600 font-medium tracking-tight">
              让每一次呼吸
              <br />
              <span className="italic text-moss-700">都被温柔看见</span>
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-500 max-w-md">
              基于可穿戴设备、毫米波雷达与多模态 AI，颐安云 Hub 在异常发生的第一秒识别风险，
              把碎片化的体征数据沉淀为可追溯的连续档案，为机构与家属搭建 7×24 的数字护盾。
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {[
                { icon: Activity, value: "8 类", label: "生命体征实时" },
                { icon: ShieldCheck, value: "12 级", label: "智能告警分级" },
                { icon: Cpu, value: "200+", label: "在网智能终端" },
              ].map((s) => (
                <div key={s.label} className="card-flat p-3">
                  <s.icon className="h-4 w-4 text-moss-700 mb-2" />
                  <div className="font-display text-[22px] font-semibold text-ink-600 leading-none">{s.value}</div>
                  <div className="text-[11px] text-ink-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-ink-300 mt-6">
            © 2026 颐安云科技 · 智慧养老监护管理平台 · 演示版本
          </div>
        </div>
      </div>

      {/* Right role picker */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[520px] stagger">
          <div className="text-[12px] uppercase tracking-[0.22em] text-moss-700 font-medium">演示登录</div>
          <h2 className="font-display text-[36px] font-semibold text-ink-600 leading-tight mt-2">
            选择您的 <span className="italic">角色身份</span>
          </h2>
          <p className="text-[13.5px] text-ink-500 mt-2 mb-8">
            颐安云支持多端角色协同，请选择您要体验的身份进入对应工作台。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = picked === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onEnter(r.id)}
                  disabled={loading}
                  className={cn(
                    "group relative text-left rounded-2xl p-4 border transition-all duration-200 bg-white/60 backdrop-blur",
                    active
                      ? "border-sand-400 shadow-glow -translate-y-0.5"
                      : "border-ink-100 hover:border-moss-700/40 hover:shadow-soft hover:-translate-y-0.5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-soft",
                        r.chip,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[15px] text-ink-600">{r.name}</div>
                      <div className="text-[11.5px] text-ink-400 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-ink-400 font-mono">
                      <Heart className="h-3 w-3" /> 演示 · {r.id}
                    </div>
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center transition",
                        active ? "bg-sand-400 text-moss-800" : "bg-ink-50 text-ink-300 group-hover:bg-moss-700 group-hover:text-sand-50",
                      )}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 card-flat p-4 text-[12px] text-ink-500 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-moss-700 mt-0.5" />
            <div>
              所有数据为模拟生成，不会与任何真实系统通信。 切换角色可在右上角随时进行，
              实时数据流（生命体征、告警）将以 ≥ 1Hz 频率持续刷新。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
