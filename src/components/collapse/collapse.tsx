import React, { useState, CSSProperties } from 'react';
import { CollapseProps } from './collapse.props';
import MaterialCollapse from '@material-ui/core/Collapse';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';

const HEADER: CSSProperties = {
  display: 'flex',
  paddingTop: 10,
  paddingBottom: 0,
  borderBottom: '1px solid #cfcfcf',
  cursor: 'pointer',
};

const ICON: CSSProperties = {
  right: 0,
  color: '#cfcfcf',
};

const Collapse = function AutoCompleteTypeahead(props: CollapseProps) {
  const { topic, children, isExpanded = false } = props;

  const [open, setOpen] = useState(isExpanded);

  return (
    <>
      <div id="collapse-header" style={HEADER} onClick={() => setOpen(!open)}>
        <div style={{ flex: '95%' }}>{topic}</div>
        <div style={{ flex: '1' }}>
          <span style={ICON}>
            <ChevronDownIcon label={'chevron-down'} size={'large'} />
          </span>
        </div>
      </div>
      <MaterialCollapse in={open} timeout="auto" unmountOnExit>
        <div id="collapse-content">{children}</div>
      </MaterialCollapse>
    </>
  );
};

export default Collapse;