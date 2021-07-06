import React from 'react';
import { DateTimePicker as DTP } from '@atlaskit/datetime-picker';

interface DateTimePickerProps {
  initialValue?: string;
  initialIsOpen?: boolean;
  locale?: string;
  onChange?: (value: string) => any;
}

interface DateTimePickerState {
  value: string;
  isOpen: boolean;
}

class DateTimePicker extends React.Component<DateTimePickerProps, DateTimePickerState> {
  state: DateTimePickerState = {
    value: '',
    isOpen: false,
  };

  recentlySelected = false;
  recSelTimeoutId: number | null = null;

  componentDidUpdate(prevProps: DateTimePickerProps, prevState: DateTimePickerState) {
    if (prevState.value != this.state.value && this.props.onChange != null) this.props.onChange(this.state.value);
  }

  componentDidMount() {
    const value = this.props.initialValue || new Date().toISOString().replace(/(Z|z)/, '+07:00');
    if (!this.props.initialValue && this.props.onChange) this.props.onChange(value);
    this.setState({
      value,
      isOpen: this.props.initialIsOpen || false,
    });
  }

  componentWillUnmount() {
    if (this.recSelTimeoutId != null) {
      clearTimeout(this.recSelTimeoutId);
      this.recSelTimeoutId = null;
    }
  }

  handleClick = () => {
    if (!this.recentlySelected) this.setState({ isOpen: true });
  }

  onValueChange = (value: string) => {
    console.log('datetimepicker change', value);
    this.setState({ value, isOpen: false }, () => {
      this.recSelTimeoutId = setTimeout(() => {
        this.recSelTimeoutId = null;
        this.recentlySelected = false;
      }, 200);
    });
  }

  onBlur = () => this.setState({ isOpen: false });

  render() {
    return (
      <div onClick={this.handleClick} style={this.props.style}>
        <DTP value={this.state.value} onChange={this.onValueChange} onBlur={this.onBlur} locale={this.props.locale} />
      </div>
    );
  }

}

export default DateTimePicker;