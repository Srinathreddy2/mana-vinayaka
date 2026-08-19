"use client";

import { useEffect, useState } from "react";
import { useBlobUrl } from "@/lib/hooks";
import { useDerivedVideoPoster } from "@/lib/videoPoster";
import type { Media } from "@/lib/types";
import { PhotoArt } from "./PhotoArt";

interface Props {
  media?: Media;
  seed?: string;
  className?: string;
  /** Extra classes on the picture itself — hover zooms live here. */
  imageClassName?: string;
  showPlay?: boolean;
  playable?: boolean;
}

/**
 * One picture.
 *
 * Everything lands the same way regardless of source: soft and blurred,
 * then resolving over ~700ms once decoded. Generated artwork resolves
 * on mount; uploaded files resolve on the image's load event.
 */
export function MediaFrame({
  media,
  seed,
  className,
  imageClassName = "",
  showPlay = true,
  playable = false,
}: Props) {
  const url = useBlobUrl(media?.blobKey);
  const storedPoster = useBlobUrl(media?.posterKey);
  const mediaUrl = media?.src ?? url ?? undefined;
  const isVideo = media?.kind === "video";

  // Videos saved before posters were stored have no posterKey — decode a
  // frame on demand rather than leaving the card blank.
  const derivedPoster = useDerivedVideoPoster(
    isVideo && !media?.posterKey ? mediaUrl : undefined,
  );

  // An <img> cannot decode a video file; pointing it at one is what produced
  // the broken-image glyph. Videos show their poster or nothing at all.
  const src = isVideo ? storedPoster ?? derivedPoster ?? undefined : mediaUrl;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!media?.blobKey && !media?.src && !src) {
      const t = setTimeout(() => setLoaded(true), 30);
      return () => clearTimeout(t);
    }
  }, [media?.blobKey, media?.src, src]);

  if (!media) {
    return <div className={`bg-ink-800 ${className ?? ""}`} />;
  }

  if (isVideo && mediaUrl && playable) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={mediaUrl}
        poster={src}
        controls
        preload="metadata"
        playsInline
        className={`${className ?? ""}`}
      />
    );
  }

  const picture = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={media.alt ?? ""}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      ref={(el) => {
        if (el && el.complete && el.naturalWidth > 0 && !loaded) {
          setLoaded(true);
        }
      }}
      style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
      className={`media-img size-full object-cover ${loaded ? "is-loaded" : ""} ${imageClassName}`}
    />
  ) : media.art ? (
    <PhotoArt
      art={media.art}
      seed={seed ?? media.id}
      className={`media-img size-full ${loaded ? "is-loaded" : ""} ${imageClassName}`}
    />
  ) : (
    <div className="size-full bg-linear-to-b from-ink-800 to-ink-950" />
  );

  return (
    <div className={`relative isolate overflow-hidden bg-ink-850 ${className ?? ""}`}>
      {picture}
      {media.kind === "video" && showPlay && <PlayBadge />}
    </div>
  );
}

function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center">
      <span className="grid size-14 place-items-center rounded-full border border-brass-300/40 bg-ink-950/50 text-brass-200 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
    </span>
  );
}
