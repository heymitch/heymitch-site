interface ResourceCardProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function ResourceCard({
  title,
  description,
  image,
  url,
}: ResourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-white/10 bg-surface/50 p-6 transition-all duration-300 hover:border-white/20 hover:bg-surface/80"
    >
      <div className="flex justify-center mb-5">
        <img
          src={image}
          alt={title}
          className="w-40 h-40 object-contain drop-shadow-lg transition-transform duration-300 ease-out group-hover:rotate-[-2deg] group-hover:scale-105 group-hover:-translate-y-1"
        />
      </div>

      <h3 className="font-garamond text-xl font-semibold mb-2">{title}</h3>

      <p className="text-white/50 text-sm leading-relaxed mb-4">
        {description}
      </p>

      <span className="inline-flex items-center gap-2 text-coral text-sm font-medium group-hover:gap-3 transition-all duration-200">
        Get it free
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </a>
  );
}
