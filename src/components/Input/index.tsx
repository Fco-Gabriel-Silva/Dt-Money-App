import { TextInput, TextInputProps } from "react-native";
import { useEffect, useRef, forwardRef } from "react";
import { fontFamily } from "@/styles/fontFamily";

export const Input = forwardRef<TextInput, TextInputProps>(
  ({ style, ...rest }, ref) => {
    const internalRef = useRef<TextInput>(null);

    useEffect(() => {
      const refToUse = (ref as any) || internalRef;

      if (refToUse.current) {
        refToUse.current.setNativeProps({
          style: {
            fontFamily: fontFamily.sans,
          },
        });
      }
    }, []);

    return (
      <TextInput
        ref={(ref as any) || internalRef}
        style={[{ fontFamily: fontFamily.sans }, style]}
        {...rest}
      />
    );
  },
);
