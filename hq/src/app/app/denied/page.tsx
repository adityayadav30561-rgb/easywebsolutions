import { Empty } from "@/components/ui";

export default function Denied() {
  return (
    <div className="card">
      <Empty title="You don't have access to this page">Your role doesn&apos;t include this permission, or the module isn&apos;t enabled for your organisation. Ask an owner or admin if you need it.</Empty>
    </div>
  );
}
