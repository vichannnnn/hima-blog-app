import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const SyntaxHighlight: React.FC<any> = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={materialDark}
      language={match[1]}
      PreTag="div"
      className="codeStyle"
      {...props}
    />
  ) : (
    <code className={className} {...props} />
  );
};
export default SyntaxHighlight;
