import { lusitana } from '@/app/ui/fonts';
import FlowTerm from '@/app/ui/xterm/flow-term';

export default function Home() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>term-pty</h1>
      </div>
      <FlowTerm placeholder="nodePty" />
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <CreateInvoice /> */}
      </div>
    </div>
  );
}