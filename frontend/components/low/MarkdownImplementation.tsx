"use client";

import MDEditor from "@uiw/react-md-editor";

export const MarkdownOnly: React.FC<{source: string}> = ({source}) => {
  return (
    <MDEditor.Markdown
      source={source}
      className="leading-relaxed text-gray-700"
    />
  );
};