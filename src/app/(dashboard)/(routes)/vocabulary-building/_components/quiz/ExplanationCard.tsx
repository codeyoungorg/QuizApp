type ExplanationCardProps = {
  text: string;
};

export default function ExplanationCard({ text }: ExplanationCardProps) {
  return (
    <div className="bg-[#F8F8F8] rounded-xl p-4 mt-6">
      <p className="text-sm font-bold text-[#404040] mb-1">Here&apos;s why!</p>
      <p className="text-sm text-[#999999] leading-relaxed">{text}</p>
    </div>
  );
}
