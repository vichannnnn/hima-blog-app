import type { Meta, StoryObj } from '@storybook/react';
import { ButtonBase } from '@components';

const meta = {
  title: 'Example/Button',
  component: ButtonBase,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    borderColor: { control: 'color' },
    backgroundColor: { control: 'color' },
    fontSize: { control: 'text' },
    fontFamily: { control: 'text' },
    fontColor: { control: 'color' },
    hoverColor: { control: 'color' },
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    children: 'Button',
    fontSize: '16px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Button',
    fontSize: '16px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Button',
    fontSize: '16px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Button',
    fontSize: '16px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};
