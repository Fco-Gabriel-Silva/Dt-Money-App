import { Text as RNText, TextProps } from "react-native";
import { cn } from "@/shared/utils/tw-merge";

interface Props extends TextProps {
  className?: string;
}

export function Text({ className, style, ...props }: Props) {
  return (
    <RNText
      className={cn("font-sans text-base text-gray-200", className)}
      style={style}
      {...props}
    />
  );
}
