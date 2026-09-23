import Icon from '@/components/ui/icon';
import type { Project } from '@/data/cabinet';

const WEEK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

/** Календарь месяца с отметкой встречи и сегодняшнего дня. */
const MiniCalendar = ({ data }: { data: Project['calendar'] }) => {
  const cells: (number | null)[] = [
    ...Array.from({ length: data.first - 1 }, () => null),
    ...Array.from({ length: data.days }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[0.5rem] uppercase tracking-[0.1em] text-white/35">{data.month}</p>
        <Icon name="CalendarDays" size={10} className="text-white/35" />
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-[2px]">
        {WEEK.map((w) => (
          <span key={w} className="text-center text-[0.42rem] text-white/25">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const today = d === data.today;
          const meet = d === data.meeting.day;
          return (
            <span
              key={d}
              className="flex h-[13px] items-center justify-center rounded-[3px] text-[0.46rem] tabular-nums"
              style={{
                background: meet ? '#2f6df6' : today ? 'rgba(255,255,255,.12)' : 'transparent',
                color: meet ? '#fff' : today ? '#fff' : 'rgba(255,255,255,.45)',
              }}
            >
              {d}
            </span>
          );
        })}
      </div>

      <div className="mt-2 flex items-start gap-1.5 rounded-md border border-[#2f6df64d] bg-[#2f6df61a] px-2 py-1.5">
        <Icon name="Users" size={9} className="mt-[1px] shrink-0 text-[#8fb4ff]" />
        <div className="min-w-0">
          <p className="truncate text-[0.5rem] text-white/85">{data.meeting.title}</p>
          <p className="text-[0.46rem] text-white/45">
            {data.meeting.day} {data.month.toLowerCase()} · {data.meeting.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
