import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md stagger">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-sand-100 text-moss-700 flex items-center justify-center mb-4">
          <Compass className="h-6 w-6" />
        </div>
        <h1 className="font-display text-[48px] font-semibold text-ink-600 leading-none">404</h1>
        <p className="text-[14px] text-ink-500 mt-3">
          您寻找的页面已不在我们照护的版图内，请返回仪表盘继续工作。
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-moss-700 px-4 text-[13px] font-semibold text-sand-50 hover:bg-moss-800"
        >
          回到仪表盘
        </Link>
      </div>
    </div>
  );
}
