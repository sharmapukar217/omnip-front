import {
  Field as FormField,
  FieldArray as FormFieldArray,
  Form as FormRoot
} from "vee-validate";

import FormControl from "./FormControl.vue";
import FormDescription from "./FormDescription.vue";
import FormInput from "./FormInput.vue";
import FormItem from "./FormItem.vue";
import FormLabel from "./FormLabel.vue";
import FormMessage from "./FormMessage.vue";
import FormRadioGroup from "./FormRadioGroup.vue";
import FormRadioGroupItem from "./FormRadioGroupItem.vue";
import FormTextArea from "./FormTextArea.vue";

export const Form = {
  Root: FormRoot,
  Field: FormField,
  FieldArray: FormFieldArray,
  Item: FormItem,
  Label: FormLabel,
  Input: FormInput,
  Control: FormControl,
  Message: FormMessage,
  Description: FormDescription,
  RadioGroup: FormRadioGroup,
  RadioGroupItem: FormRadioGroupItem,
  TextArea: FormTextArea
};

export {
  FormControl,
  FormDescription,
  FormField,
  FormFieldArray,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
  FormRadioGroupItem,
  FormRoot,
  FormTextArea
};
