import TextIcon from '@assets/svgs/TextIcon';
import ParagraphIcon from '@assets/svgs/ParagraphIcon';
import NumericIcon from '@assets/svgs/NumericIcon';
import RadioIcon from '@assets/svgs/RadioIcon';
import CheckboxIcon from '@assets/svgs/CheckboxIcon';

export const questionTypes = [
  {
    value: 'short_text',
    label: 'Short Answer',
    icon: TextIcon,
  },

  {
    value: 'text',
    label: 'Paragraph',
    icon: ParagraphIcon,
  },
  {
    value: 'decimal_input',
    label: 'Numeric Input',
    icon: NumericIcon,
  },
  {
    value: 'radio_button',
    label: 'Multiple Choice',
    icon: RadioIcon,
  },
  { value: 'checkbox', label: 'Checkbox', icon: CheckboxIcon },
];

export const mediaTypes = [
  { value: 'image', label: 'Image' },
  {
    value: 'video',
    label: 'Video',
  },
  {
    value: 'audio',
    label: 'Audio',
  },
  {
    value: 'multiple_images',
    label: 'Multiple Images',
  },
];
