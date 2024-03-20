import type { LucideIcon } from "lucide-react-native";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  XCircle,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(AlertCircle);
interopIcon(CheckCircle);
interopIcon(XCircle);
interopIcon(ChevronLeft);

export { AlertCircle, CheckCircle, XCircle, ChevronLeft };
