import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/single-select';
import { useMst } from '../../stores/root-store';
import { observer } from 'mobx-react-lite';

const getItems = (count: number, offset: number): object =>
  Array.from({ length: count }, (v, k): number => k).map((k: number): {} => ({
    id: `item-${k + offset}`,
    productName: `Item: ${k + offset}, Random value: ${Math.round(Math.random() * 100)}`,
    from: {
      dateTime: new Date().toISOString(),
    },
    color: Math.random() > 0.66 ? 'pink' : Math.random() > 0.5 ? 'lightgreen' : 'beige',
  }));

const reorder = (list: [], startIndex: number, endIndex: number): object => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source: any, destination: any, droppableSource: any, droppableDestination: any): {} => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  let result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 4;

const getItemStyle = (isDragging: boolean, draggableStyle: any): object => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'lightgrey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): object => ({
  background: isDraggingOver ? 'lightblue' : '#eee',
  padding: grid,
  margin: '3px',
  flex: 1,
});

interface State {
  jobs: object;
  trucks: object;
}
interface Props {}

const AddTrip: React.FC<Props> = observer(() => {
  const { jobStore } = useMst();
  const [state, setState] = useState<any>({
    jobs: [],
    // trucks: [],
    trucks: getItems(5, 10),
  });
  const [searchJob, setSearchJob] = useState<any>('');
  const [searchTruck, setSearchTruck] = useState<any>('');

  const selectItems = [
    {
      items: [
        { content: 'Sydney', value: 'city_1' },
        { content: 'Canberra', value: 'city_2' },
        { content: 'Melbourne', value: 'city_3' },
        { content: 'Perth', value: 'city_4', isDisabled: true },
      ],
    },
  ];

  const selectedItem = selectItems[0].items[0];

  useEffect(() => {
    return () => {
      jobStore.clearJobs();
    };
  }, []);

  useEffect(() => {
    console.log('jobStore.data_jobs?.content?.length :>> ', jobStore.data_jobs?.content?.length);
    if (jobStore.data_jobs?.content?.length) {
      setState((prevState: any) => ({
        ...prevState,
        jobs: JSON.parse(JSON.stringify(jobStore.data_jobs?.content)),
      }));
    }
  }, [JSON.stringify(jobStore.data_jobs)]);

  const droppableIds: any = {
    droppable1: 'jobs',
    droppable2: 'trucks',
  };

  const getList = (id: string): any => state[droppableIds[id]];

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: object = reorder(getList(source.droppableId), source.index, destination.index);

      let copiedState: any = Object.assign({}, state);

      if (source.droppableId === 'droppable1') {
        copiedState.jobs = items;
      } else if (source.droppableId === 'droppable2') {
        copiedState.trucks = items;
      }

      setState(copiedState);
    } else {
      const result: any = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      setState({
        jobs: result.droppable1 ? result.droppable1 : state.jobs,
        trucks: result.droppable2 ? result.droppable2 : state.trucks,
      });
    }
  };

  const onChangeValueJob = (e: any) => {
    const value = e.target.value;
    setSearchJob(value);
  };

  const onChangeValueTruck = (e: any) => {
    const value = e.target.value;
    setSearchTruck(value);
  };

  const onSubmitJob = () => {
    jobStore.getJobsList({ page: 1, descending: true, textSearch: searchJob });
  };

  const onSubmitTruck = () => {
    console.log('Submit truck');
  };

  const lists = [
    {
      droppableId: 'droppable1',
      listId: 'jobs',
      title: 'Search jobs',
      droppable: false,
      onChange: onChangeValueJob,
      onSubmit: onSubmitJob,
    },
    {
      droppableId: 'droppable2',
      listId: 'trucks',
      title: 'Search trucks',
      droppable: true,
      onChange: onChangeValueTruck,
      onSubmit: onSubmitTruck,
    },
  ];

  console.log('jobStore.loading :>> ', jobStore.loading);

  return (
    <div style={{ display: 'flex' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {lists.map((list, listIndex) => (
          <Droppable
            key={`${list.listId}-droppable-${listIndex}`}
            droppableId={list.droppableId}
            isDropDisabled={list.droppable}
          >
            {(provided: any, snapshot: any) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                <Form onSubmit={list.onSubmit}>
                  {({ formProps }: any) => (
                    <form {...formProps}>
                      <Field name={list.title}>
                        {({ fieldProps }: any) => (
                          <Textfield placeholder={list.title} {...fieldProps} onChange={(e: any) => list.onChange(e)} />
                        )}
                      </Field>
                    </form>
                  )}
                </Form>
                {jobStore.loading && <h1>Loading ...</h1>}
                {state[list.listId] &&
                  state[list.listId].map((item: any, index: number) => (
                    <Draggable
                      key={`${list.listId}-${item.id}-${index}`}
                      draggableId={`${list.listId}-${item.id}-${index}`}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <div style={{ background: item.color }}>{item.productName}</div>
                          <div style={{ background: item.color }}>{item?.from?.dateTime ?? ''}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
});

export default AddTrip;
