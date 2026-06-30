'use client';

interface CategoryHeroBackgroundProps {
  src: string;
  alt: string;
  gradientClass: string;
}

export default function CategoryHeroBackground({
  src,
  alt,
  gradientClass,
}: CategoryHeroBackgroundProps) {
  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          decoding="sync"
          fetchPriority="high"
        />
      </div>
      <div className={`absolute inset-0 z-[1] bg-gradient-to-br ${gradientClass}`} />
    </>
  );
}
