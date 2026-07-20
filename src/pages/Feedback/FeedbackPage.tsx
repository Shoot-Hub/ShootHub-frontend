import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Headphones,
  Home,
  Mail,
  MessageCircleQuestion,
  PencilLine,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { PageShell } from '@/components/marketing';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { FeedbackHero } from './feedback/FeedbackHero';
import { FeedbackForm } from './feedback/FeedbackForm';
import { FeedbackSidebar } from './feedback/FeedbackSidebar';
import { FeedbackTrustBar } from './feedback/FeedbackTrustBar';
import { RecentReviews } from './feedback/RecentReviews';
import { submittedFeedbackToReview, type SubmittedFeedback } from './feedback/data';

export function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<SubmittedFeedback | null>(null);

  return (
    <PageShell>
      <FeedbackHero />

      <Container size="wide" padding="tight" className="pb-16">
        {submitted && submittedFeedback ? (
          <SubmittedExperience
            feedback={submittedFeedback}
            onReset={() => {
              setSubmitted(false);
              setSubmittedFeedback(null);
            }}
          />
        ) : (
          <div className="space-y-8">
            <div className="rounded-[24px] border border-[#EEF0F4] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(108,59,255,0.12)] sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <FeedbackForm
                  onSuccess={(feedback) => {
                    setSubmittedFeedback(feedback);
                    setSubmitted(true);
                  }}
                  className="rounded-none border-none p-0 shadow-none"
                />
                <div className="border-t border-[#EEF0F4] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <FeedbackSidebar compact />
                </div>
              </div>
            </div>
            <FeedbackTrustBar />
            <RecentReviews />
          </div>
        )}
      </Container>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #EEF0F4;
          background: #FAFBFC;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: rgba(108, 59, 255, 0.35);
          box-shadow: 0 0 0 3px rgba(108, 59, 255, 0.08);
        }
        .field-input::placeholder { color: #A0A4B0; }
      `}</style>
    </PageShell>
  );
}

function SubmittedExperience({
  feedback,
  onReset,
}: {
  feedback: SubmittedFeedback;
  onReset: () => void;
}) {
  const date = new Date(feedback.submittedAt);
  const formatted = date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const submissionId = `#SHB-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <section className="rounded-[24px] border border-[#EDEEF5] bg-white p-5 shadow-[0_10px_30px_-14px_rgba(108,59,255,0.18)] sm:p-8">
          <div className="text-center">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#C9F5DE] opacity-60 blur-lg" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F9EF] ring-8 ring-[#F2FCF6]">
                <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
              </div>
            </div>
            <h2 className="mt-3 text-4xl font-bold text-[#111827]">Thank You! 🎉</h2>
            <p className="mt-2 text-base text-[#2D3436]">Your feedback has been submitted successfully.</p>
            <p className="mt-1 text-sm text-[#636E72]">We really appreciate you taking the time to help us improve.</p>
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-[#EEF0F4] bg-[#FAFBFF] p-4 sm:grid-cols-3">
            <SummaryItem icon={Mail} label="Submission ID" value={submissionId} />
            <SummaryItem icon={CalendarDays} label="Submitted On" value={formatted} />
            <SummaryItem icon={Clock3} label="Expected Response" value="Within 48 hours" />
          </div>

          <div className="mt-4 rounded-2xl border border-[#EEF0F4] bg-[#F8F6FF] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <Bell className="h-4 w-4 text-[#6C3BFF]" />
              We&apos;ll keep you updated!
            </p>
            <p className="mt-1 text-sm text-[#636E72]">
              You will receive an email at {feedback.email || 'your inbox'} once we respond to your feedback.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-end">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6C3BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_-6px_rgba(108,59,255,0.55)] hover:bg-[#5A2FE0]"
            >
              <PencilLine className="h-4 w-4" />
              Submit Another Feedback
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-[#EDEEF5] bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-[#111827]">Your Submitted Review</h3>
            <div className="mt-4 space-y-3 rounded-xl border border-[#EEF0F4] bg-[#FBFCFF] p-4">
              <div>
                <p className="text-xs font-semibold text-[#6B7280]">Your Rating</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E5E7EB]')} />
                  ))}
                  <span className="ml-1 text-xs font-semibold text-[#16A34A]">Excellent</span>
                </div>
              </div>
              <ReviewBlock title="What did you like the most?" value={feedback.likes || 'Great overall experience with ShootHub.'} />
              <ReviewBlock title="What can we improve?" value={feedback.improve || 'No major improvements suggested.'} />
              <ReviewBlock
                title="Any additional comments?"
                value={
                  feedback.recommend === 'yes'
                    ? 'Overall a fantastic experience. Keep up the good work! 👍'
                    : feedback.recommend === 'maybe'
                      ? 'Good experience overall with a few areas to polish.'
                      : feedback.recommend === 'no'
                        ? 'I had some concerns. Hoping to see improvements soon.'
                        : 'No additional comments shared.'
                }
              />
            </div>
          </section>

          <section className="rounded-[20px] border border-[#EDEEF5] bg-white p-5">
            <h4 className="text-2xl font-bold text-[#111827]">Need Help?</h4>
            <p className="mt-2 text-sm text-[#636E72]">If you have any urgent concerns, feel free to contact our support team.</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#6C3BFF] hover:bg-[#F8F6FF]">
              <Headphones className="h-4 w-4" />
              Contact Support
            </button>
          </section>
        </aside>
      </div>

      <section className="rounded-[20px] border border-[#EDEEF5] bg-white p-5">
        <h3 className="text-2xl font-bold text-[#111827]">Frequently Asked Questions</h3>
        <div className="mt-4 grid gap-3 border-t border-[#EEEFF5] pt-4 md:grid-cols-3">
          <FaqItem icon={Clock3} title="How long does it take to get a response?" desc="We usually respond within 48 hours." />
          <FaqItem icon={Mail} title="How will I get the response?" desc={`We will email you at ${feedback.email || 'your registered email'}.`} />
          <FaqItem icon={MessageCircleQuestion} title="Can I update my feedback?" desc="Yes! Our team may reach out for more details." />
        </div>
      </section>

      <RecentReviews prepend={[submittedFeedbackToReview(feedback)]} />
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF]">
        <Icon className="h-4 w-4 text-[#6C3BFF]" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-[#A0A4B0]">{label}</p>
        <p className="text-xs font-semibold text-[#2D3436]">{value}</p>
      </div>
    </div>
  );
}

function ReviewBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-t border-[#EEF0F4] pt-3">
      <p className="text-xs font-semibold text-[#111827]">{title}</p>
      <p className="mt-1 text-sm text-[#636E72]">{value}</p>
    </div>
  );
}

function FaqItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#FCFCFF] p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EEFF]">
        <Icon className="h-5 w-5 text-[#6C3BFF]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111827]">{title}</p>
        <p className="mt-1 text-xs text-[#636E72]">{desc}</p>
      </div>
    </div>
  );
}
