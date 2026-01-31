import * as React from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const typeColors: Record<string, string> = {
  anime: "from-rose-500/20 to-pink-600/20 border-rose-500/30",
  drama: "from-amber-500/20 to-orange-600/20 border-amber-500/30",
  film: "from-violet-500/20 to-purple-600/20 border-violet-500/30",
}
const typeLabel: Record<string, string> = {
  anime: "Anime",
  drama: "Drama",
  film: "Film",
}

export interface MediaCardProps {
  title: string
  image: string
  year?: string
  rating?: string
  type?: "anime" | "drama" | "film"
  featured?: boolean
  href?: string
  className?: string
}

function MediaCard({
  title,
  image,
  year = "",
  rating = "",
  type = "film",
  featured = false,
  href = "#",
  className,
}: MediaCardProps) {
  return (
    <Card
      className={cn(
        "media-card block rounded-xl overflow-hidden bg-[#1a1a24] border border-white/[0.06] p-0 gap-0 shadow-none group min-w-[140px] sm:min-w-[180px] cursor-pointer",
        featured && "aspect-[2/3] sm:aspect-video",
        className
      )}
    >
      <a href={href} className="block">
        <div className="relative aspect-[2/3] sm:aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span
              className={cn(
                "inline-block px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r border text-white",
                typeColors[type]
              )}
            >
              {typeLabel[type]}
            </span>
            {(year || rating) && (
              <p className="text-xs text-zinc-300 mt-1">
                {year}
                {year && rating ? " · " : ""}
                {rating && `${rating} ★`}
              </p>
            )}
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white ml-0.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
          </div>
        </div>
        {!featured && (
          <CardContent className="p-2.5 sm:p-3 px-3">
            <CardTitle className="font-semibold text-sm sm:text-base text-white line-clamp-2 group-hover:text-rose-400 transition-colors">
              {title}
            </CardTitle>
          </CardContent>
        )}
      </a>
    </Card>
  )
}

export { MediaCard }
export default MediaCard