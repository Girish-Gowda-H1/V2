import { useCallback, useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';

export default function CustomDatePicker({ sx, placeholder = '', onReset = () => null, defaultValue = [], onOk = () => null, changeset = () => null, ...inputProps }) {
  const [open, setOpen] = useState(false);
  const [calenderValue, setCalenderValue] = useState(defaultValue);

  const changeButtonText = useCallback(() => {
    const submitButton = document.querySelector('.rs-btn-primary');
    if (submitButton) {
      submitButton.innerHTML = 'APPLY FILTER';
      submitButton.style.fontSize = '14px';
      submitButton.style.fontFamily = 'MulishBold';
      submitButton.style.padding = '10px 26px';
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const addResetAllButton = useCallback(() => {
    const parentToolbar = document.querySelector('.rs-picker-toolbar .rs-stack-item');
    const parentChild = [...parentToolbar.children];
    if (parentChild.length === 0) {
      const resetAllButton = document.createElement('button');
      resetAllButton.innerHTML = 'RESET ALL';
      resetAllButton.className = 'rs-picker-toolbar-left rs-btn rs-btn-sm';
      resetAllButton.style.background = 'transparent';
      resetAllButton.style.fontSize = '14px';
      resetAllButton.style.textDecoration = 'underline';
      resetAllButton.style.fontFamily = 'MulishBold';
      resetAllButton.onclick = () => {
        setCalenderValue([]);
        onReset();
      };
      parentToolbar.appendChild(resetAllButton);
    }
  }, [onReset]);

  const updateCalenderIcon = () => {
    const currentElement = document.getElementsByClassName('rs-picker-toggle-caret rs-icon')[0];
    if (currentElement) {
      const currentParent = currentElement.parentElement;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('id', 'uuid-adbd6eac-f921-4e43-8f0a-fcc25fe363ab');
      svg.setAttribute('viewBox', '0 0 30 30');
      svg.setAttribute('class', 'rs-picker-toggle-caret rs-icon custom-svg');

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = '.uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2{fill:#020202;}';
      defs.appendChild(style);

      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute('class', 'uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2');
      path1.setAttribute(
        'd',
        'm26.18,30.14H3.87c-1.53,0-2.77-1.24-2.77-2.77V5.06c0-1.53,1.24-2.77,2.77-2.77h22.31c1.53,0,2.77,1.24,2.77,2.77v22.31c0,1.53-1.24,2.77-2.77,2.77ZM3.87,4.28c-.43,0-.77.35-.77.77v22.31c0,.43.35.77.77.77h22.31c.43,0,.77-.35.77-.77V5.06c0-.43-.35-.77-.77-.77H3.87Z'
      );

      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute('class', 'uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2');
      path2.setAttribute('d', 'm27.95,10.87H2.09c-.55,0-1-.45-1-1s.45-1,1-1h25.86c.55,0,1,.45,1,1s-.45,1-1,1Z');

      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute('class', 'uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2');
      path3.setAttribute('d', 'm6.99,6.06c-.55,0-1-.45-1-1V.99C5.99.44,6.43-.01,6.99-.01s1,.45,1,1v4.08c0,.55-.45,1-1,1Z');

      const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path4.setAttribute('class', 'uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2');
      path4.setAttribute('d', 'm22.92,6.06c-.55,0-1-.45-1-1V.99c0-.55.45-1,1-1s1,.45,1,1v4.08c0,.55-.45,1-1,1Z');

      const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path5.setAttribute('class', 'uuid-1f0e1067-ecc6-4b34-ba72-a9511c355eb2');
      path5.setAttribute('d', 'm15,6.06c-.55,0-1-.45-1-1V.99C14,.44,14.45-.01,15-.01s1,.45,1,1v4.08c0,.55-.45,1-1,1Z');

      svg.appendChild(defs);
      svg.appendChild(path1);
      svg.appendChild(path2);
      svg.appendChild(path3);
      svg.appendChild(path4);
      svg.appendChild(path5);

      currentElement.remove();
      currentParent.appendChild(svg);
    }
  };

  useEffect(() => {
    if (open) {
      changeButtonText();
      addResetAllButton();
    }
    const customElement = document.getElementsByClassName('custom-svg')[0];
    if (!customElement) {
      updateCalenderIcon();
    }
  }, [addResetAllButton, changeButtonText, open]);

  return (
    <DateRangePicker
      character=" to "
      format="dd-MM-yyyy"
      cleanable={false}
      size="lg"
      ranges={[]}
      editable={false}
      onChange={(value) => changeset(value)}
      onClick={() => setOpen((prev) => !prev)}
      onOpen={handleOpen}
      onClose={() => setOpen(false)}
      onOk={(attrs) => {
        setCalenderValue(attrs);
        onOk(attrs);
      }}
      renderValue={() => 'SERVICE DATE'}
      value={calenderValue}
      showOneCalendar
      placeholder={placeholder}
      style={{ width: 500, ...sx }}
      {...inputProps}
    />
  );
}
