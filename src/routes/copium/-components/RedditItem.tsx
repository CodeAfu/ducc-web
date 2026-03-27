import { motion } from "motion/react";
import { HTMLAttributes } from "react";
import AnimatedButton from "~/components/AnimatedButton";
import { cn } from "~/lib/utils";

interface RedditItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  user: string;
  subreddit: string;
  content: string;
}

const variants = {
  hover: {
    scale: 1.02,
  },
};

export default function RedditItem({
  title,
  user,
  subreddit,
  content,
  className,
}: RedditItemProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col min-h-30 max-h-60 px-4 py-4 bg-card rounded-xl shadow-lg overflow-hidden",
        className
      )}
      variants={variants}
      whileHover="hover"
    >
      <div className="flex gap-2 pb-1 mb-1 border-b-1">
        <div className="flex flex-col flex-1 overflow-hidden">
          <h1 className="font-bold sm:text-2xl text-lg h-fit truncate">
            <a
              className="hover:underline hover:text-primary transition duration-200 focus:text-primary"
              href="#"
            >
              {title}
            </a>
          </h1>
          <div className="font-medium text-muted-foreground sm:text-sm text-xs flex gap-2">
            <span className="">
              <a
                className="hover:underline hover:text-primary transition duration-200 focus:text-primary"
                href={`https://www.reddit.com/r/${subreddit}`}
              >
                r/{subreddit}
              </a>
            </span>
            <a
              className="hover:underline hover:text-primary transition duration-200 focus:text-primary"
              href={`https://www.reddit.com/u/${user}`}
            >
              u/{user}
            </a>
          </div>
        </div>
        <a
          href="#"
          className="group flex items-center justify-center text-xs whitespace-nowrap my-1 px-4 rounded 
                      bg-secondary hover:bg-secondary/80 active:bg-secondary/80 transition duration-200"
        >
          <span className="group-active:scale-120 transition duration-100">View</span>
        </a>
      </div>

      <p className="text-sm text-gray-100 line-clamp-6">{content}</p>
    </motion.div>
  );
}
