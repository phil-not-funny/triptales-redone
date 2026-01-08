import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PostResponse, PostResponseSmall } from "@/types/RequestTypes";
import { beautifyDate, formatDateString } from "@/lib/utils";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Avatar from "./Avatar";
import { PostControls } from "./PostControls";
import { MarkdownOnly } from "./MarkdownImplementation";
import { getTranslations } from 'next-intl/server';

interface EmbeddedPostProps {
  // props when embed is true
  post: PostResponseSmall;
  embed: true;
  user?: PostResponseSmall["author"];
}

interface FullPostProps {
  // props when embed is false
  post: PostResponse;
  embed: false;
  user?: PostResponse["author"];
}

export type PostProps = EmbeddedPostProps | FullPostProps;

const Post = async ({ post, embed }: PostProps) => {
  const t = await getTranslations("Post");
  const tCommon = await getTranslations("Common");

  return (
    <Card className="mx-auto mb-6 gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white py-0 shadow-sm transition-shadow duration-300 hover:shadow-md lg:w-2xl">
      <CardHeader className="relative border-b border-gray-100 p-6">
        <CardTitle className="mb-2 text-2xl font-semibold text-gray-800">
          {post.title}
        </CardTitle>
        <div className="flex items-center p-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Avatar
              user={post.author}
              className="!h-8 !w-8"
              textClassName="!text-sm"
            />
            <Link
              href={`/user/${post.author.username}`}
              className="hover:underline"
            >
              {post.author.username}
            </Link>
          </div>
          <span className="mx-2">•</span>
          <span>{t("postedOn")} {formatDateString(post.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <span className="font-medium">{t("start")}:</span>{" "}
            {formatDateString(post.startDate)}
          </div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div>
            <span className="font-medium">{t("end")}:</span>{" "}
            {formatDateString(post.endDate)}
          </div>
        </div>
      </CardHeader>
      <CardContent data-color-mode="light" className="p-6">
        <MarkdownOnly source={post.description} />
        {!embed && post.days && post.days.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {t("timelineOfDays")}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {post.days.map((day, index) => (
                <AccordionItem key={index} value={`day-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {tCommon("day")} {index + 1}: {day.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {beautifyDate(day.date)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{day.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-gray-50 !p-3">
        {embed ? (
          <PostControls embed={true} post={post as PostResponseSmall} />
        ) : (
          <PostControls embed={false} post={post as PostResponse} />
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;
