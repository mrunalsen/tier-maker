type IconName = 'reset' | 'plus' | 'upload' | 'layout' | 'trash' | 'close'

const paths: Record<IconName, React.ReactNode> = {
  reset: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>,
  layout: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M12 4v16" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></>,
  close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
}

export function Icon({ name, className = 'h-4 w-4' }: { name: IconName; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
