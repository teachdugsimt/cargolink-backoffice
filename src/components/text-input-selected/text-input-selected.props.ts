import { OptionTypeBase } from "react-select";

export interface TextInputSelectedProps extends OptionTypeBase {
  defalutValue?: string

  options?: {
    value: string,
    label: string
  }[]

  onClick?: () => void

  onChange?: (value: string) => void

  onInputChange?: (value: string) => void

  onSubmit?: (value: string) => void
}
