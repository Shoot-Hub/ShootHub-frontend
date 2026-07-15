import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Image } from '@/components/ui/Image';
import { SectionHeader } from '@/components/marketing';
import { fadeInUp, staggerContainer, cardHover } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { team } from './data';

export function MeetTeam() {
  return (
    <Section padding="lg" className="bg-[#f9f9fb]">
      <Container size="wide" padding="tight">
        <SectionHeader
          eyebrow="People"
          title={
            <>
              Meet Our <span className="text-primary-500">Team</span>
            </>
          }
          subtitle="Builders, creators, and operators obsessed with the craft."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {team.map((member) => (
            <motion.article
              key={member.name}
              variants={fadeInUp}
              whileHover={cardHover}
              className={cn(
                'overflow-hidden rounded-[24px] border bg-white shadow-card',
                member.founder === true
                  ? 'border-primary-200 ring-2 ring-primary-500/20 sm:col-span-2 lg:col-span-1'
                  : 'border-border/50',
              )}
            >
              <Image
                src={member.image}
                alt={member.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                {member.founder === true && (
                  <span className="mb-2 inline-block rounded-full bg-primary-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    Founder
                  </span>
                )}
                <h3 className="text-lg font-extrabold text-ink">{member.name}</h3>
                <p className="mt-0.5 text-sm font-semibold text-primary-500">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{member.bio}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
