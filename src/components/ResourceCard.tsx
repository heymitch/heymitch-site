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
      className="group block rounded-xl border border-brown/10 bg-cream-dark/30 p-5 transition-all duration-300 hover:border-brown/20 hover:bg-cream-dark/50"
    >
      <div className="flex justify-center mb-4">
        <img
          src={image}
          alt={title}
          className="w-32 h-32 object-contain drop-shadow-md transition-transform duration-300 ease-out group-hover:rotate-[-2deg] group-hover:scale-105 group-hover:-translate-y-1"
        />
      </div>

      <h3 className="font-bold text-brown text-lg mb-1.5">{title}</h3>

      <p className="text-brown/50 text-sm leading-relaxed mb-3">{description}</p>

      <span className="inline-flex items-center gap-2 text-orange text-sm font-semibold group-hover:gap-3 transition-all duration-200">
        Get it free
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
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
