export function StatusBadge({ status }: { status: string }) {
    const isPaid = status === "PAID";
    return (
        <span className={`
          text-[10px] 
          py-0.5 
          px-1.75 
          rounded-[20px] 
          ${isPaid ? 'bg-[rgba(17,48,28,0.15)]' : 'bg-[rgba(232,160,48,0.15)]'}
          ${isPaid ? 'text-[#4ade80]' : 'text-[(--gold)]'}
        `}
        >
            {status}
        </span>
    );
}