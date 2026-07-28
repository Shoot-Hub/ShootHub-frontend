type UserPlaceholderPageProps = {
  title: string;
  description?: string;
};

export function UserPlaceholderPage({
  title,
  description = 'This section will be available soon.',
}: UserPlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-[#2D3436]">{title}</h2>
      <p className="mt-1 text-sm text-[#8B93A1]">{description}</p>
    </section>
  );
}
