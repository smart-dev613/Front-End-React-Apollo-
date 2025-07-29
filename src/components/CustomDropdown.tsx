import React, { useState } from "react";
import styled from "styled-components";
import { BiChevronDown, BiCheckbox, BiCheckboxChecked } from "react-icons/bi";

interface Props {
  values: string[];
  title: string;
  selectedValue?: any;
}

const Page: React.FC<Props> = ({ values, title, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(title);
  const [isChecked, setIsChecked] = useState([]);

  //   useEffect(() => {
  //     const modalContainer = document.querySelector(".custom-selector-container");

  //     modalContainer.addEventListener("click", (e) => {
  //       if (e.target.classList.contains("custom-selector-container")) {
  //         setIsOpen(false);
  //       }
  //     });
  //   }, []);

  const updateValue = (val: string, type?: string, index?: number) => {
    // selectedValue(val)  TODO: pass selected drowpdown value to parent
    setCurrentValue(val);
    if (type === "Employee") {
        const arrIndex = isChecked.indexOf(index)
      if (arrIndex != -1) {
      } else {
        setIsChecked([...isChecked, index]);
      }
    }
  };

  if (title === "Employee") {
    return (
      <Container aria-label={title} isOpen={isOpen} employee={true}>
        <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <span className="first-item">{currentValue}</span>
          <BiChevronDown />
        </div>
        <div className="custom-selector-container">
          {values.map((item, index) => {
            return (
              <span
                className="custom-selector"
                key={index}
                onClick={() => updateValue(item, title, index)}
              >
                {isChecked.filter((item) => item === index).length > 0 ? (
                  <BiCheckboxChecked size="30" />
                ) : (
                  <BiCheckbox size="30"/>
                )}
                {item}
              </span>
            );
          })}
        </div>
      </Container>
    );
  }

  return (
    <Container
      aria-label={title}
      onClick={() => setIsOpen(!isOpen)}
      isOpen={isOpen}
    >
      <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <span className="first-item">{currentValue}</span>
        <BiChevronDown />
      </div>
      <div className="custom-selector-container">
        {values.map((item, index) => {
          return (
            <span
              className="custom-selector"
              key={index}
              onClick={() => updateValue(item)}
            >
              {item}
            </span>
          );
        })}
      </div>
    </Container>
  );
};

export default Page;

const Container = styled.div<{employee?:boolean, isOpen: boolean}>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({employee}) => employee ? "150%" : "100%" };
  max-width: 40%;
  border: 1px solid gray;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;

  .dropdown-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
  }

  .custom-selector-container {
    position: absolute;
    top: 110%;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    border: 1px solid gray;
    border-radius: 5px;
    background: white;
    z-index: 1000;
    pointer-events: ${({ isOpen }) => (isOpen ? "initial" : "none")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: ease-in-out 200ms;

    .custom-selector {
      width: ${({employee}) => employee ? "flex" : "initial" };
      align-items: center;
      gap: .5em;
      color: gray;
      padding: 0.5em 0.75em 0.5em 0;
      padding-left: ${({employee}) => employee ? "0" : "1em" };
      border-bottom: 1px solid lightgray;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
`;
