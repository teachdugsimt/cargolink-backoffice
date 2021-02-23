import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Select from 'react-select';

// import "./styles.css";
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const test = () => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      food: [{ value: 'chocolate' }],
      drinks: [{ name: 'martini' }],
    },
  });
  const { fields: foodFields, append: foodAppend, remove: foodRemove } = useFieldArray({ control, name: 'food' });
  const { fields: drinkFields, append: drinkAppend, remove: drinkRemove } = useFieldArray({ control, name: 'drinks' });
  const watchFood = watch('food.name');
  const onSubmit = (data: any) => {
    console.log('data', data);
  };
  console.log('Food', watchFood);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        <h5>FOOD</h5>

        {foodFields.map((item, index) => {
          return (
            <li key={item.id}>
              {/* <input
              name={`food[${index}].name`}
              ref={register}
              placeholder="food name..."
              onChange={watchFood}
            /> */}
              <Controller
                as={<Select options={options} />}
                control={control}
                onChange={([selected]) => {
                  // React Select return object instead of value for selection
                  return { value: selected };
                }}
                name={`food[${index}].name`}
                defaultValue={{ value: 'chocolate' }}
              />
              {/* {watchFood==='Burger'&& 'Burger'} */}

              <button type="button" onClick={() => foodRemove(index)}>
                Delete
              </button>
            </li>
          );
        })}
        <button
          type="button"
          onClick={() => {
            foodAppend({ name: '' });
          }}
        >
          append food
        </button>
      </ul>
      <ul>
        <h5>DRINKS</h5>
        {drinkFields.map((item, index) => {
          return (
            <li key={item.id}>
              <input name={`drinks[${index}].name`} ref={register} />
              <button type="button" onClick={() => drinkRemove(index)}>
                Delete
              </button>
            </li>
          );
        })}
        <button
          type="button"
          onClick={() => {
            drinkAppend({ name: 'New Drink' });
          }}
        >
          append drinks
        </button>
      </ul>

      <input type="submit" />
    </form>
  );
};
export default test;
