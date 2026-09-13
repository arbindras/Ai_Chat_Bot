import { lazy, Suspense } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// react-syntax-highlighter's default `Prism` export bundles its *entire*
// ~250-language catalog (nearly 1MB) into whatever chunk imports it, even
// behind a dynamic import(). `PrismAsyncLight` + explicit per-language
// registration avoids that: only the languages listed below (a set that
// covers the overwhelming majority of real chat output) are ever
// downloaded, and only once a code block actually needs highlighting.
// Anything outside this set still renders as plain, readable text via the
// fallback in ChatItem — never broken, just unhighlighted.
const HighlightedCode = lazy(async () => {
  const [{ PrismAsyncLight }, stylesMod, ...languageModules] = await Promise.all([
    import("react-syntax-highlighter"),
    import("react-syntax-highlighter/dist/esm/styles/prism"),
    import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/jsx"),
    import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
    import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
    import("react-syntax-highlighter/dist/esm/languages/prism/python"),
    import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
    import("react-syntax-highlighter/dist/esm/languages/prism/json"),
    import("react-syntax-highlighter/dist/esm/languages/prism/css"),
    import("react-syntax-highlighter/dist/esm/languages/prism/markup"),
    import("react-syntax-highlighter/dist/esm/languages/prism/sql"),
    import("react-syntax-highlighter/dist/esm/languages/prism/java"),
    import("react-syntax-highlighter/dist/esm/languages/prism/c"),
    import("react-syntax-highlighter/dist/esm/languages/prism/cpp"),
    import("react-syntax-highlighter/dist/esm/languages/prism/go"),
    import("react-syntax-highlighter/dist/esm/languages/prism/rust"),
    import("react-syntax-highlighter/dist/esm/languages/prism/yaml"),
    import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
    import("react-syntax-highlighter/dist/esm/languages/prism/diff"),
  ]);

  const { oneDark, oneLight } = stylesMod;
  const register: [string, string[]][] = [
    ["javascript", ["js"]],
    ["jsx", []],
    ["typescript", ["ts"]],
    ["tsx", []],
    ["python", ["py"]],
    ["bash", ["sh", "shell", "zsh"]],
    ["json", []],
    ["css", []],
    ["markup", ["html", "xml", "svg"]],
    ["sql", []],
    ["java", []],
    ["c", []],
    ["cpp", ["c++"]],
    ["go", ["golang"]],
    ["rust", ["rs"]],
    ["yaml", ["yml"]],
    ["markdown", ["md"]],
    ["diff", []],
  ];
  register.forEach(([name, aliases], i) => {
    const mod = languageModules[i]!.default;
    PrismAsyncLight.registerLanguage(name, mod);
    aliases.forEach((alias) => PrismAsyncLight.registerLanguage(alias, mod));
  });

  return {
    default: ({
      language,
      code,
      mode,
    }: {
      language: string;
      code: string;
      mode: "light" | "dark";
    }) => (
      <PrismAsyncLight
        style={mode === "dark" ? oneDark : oneLight}
        language={language}
        PreTag="div"
        fallback={<PlainFallback code={code} />}
      >
        {code}
      </PrismAsyncLight>
    ),
  };
});

const PlainFallback = ({ code }: { code: string }) => (
  <Box
    component="pre"
    sx={{
      m: 0,
      p: 1.5,
      borderRadius: 2,
      overflowX: "auto",
      bgcolor: "action.hover",
      fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      fontSize: 13,
    }}
  >
    <code>{code}</code>
  </Box>
);

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const theme = useTheme();
  return (
    <Suspense fallback={<PlainFallback code={code} />}>
      <HighlightedCode language={language} code={code} mode={theme.palette.mode} />
    </Suspense>
  );
};

export default CodeBlock;
