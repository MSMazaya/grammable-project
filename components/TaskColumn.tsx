import React, { useState } from "react";
import {
    useSortable, arrayMove, sortableKeyboardCoordinates,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable
} from "@dnd-kit/core";


export function Item(props) {
    const { id } = props;


    return <div className="block p-2 my-2 text-center max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">{id}</div>;
}

function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Item id={props.id} />
        </div>
    );
}



function Container(props) {
    const { id, items, color } = props;

    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <SortableContext
            id={id}
            items={items}
            strategy={verticalListSortingStrategy}
        >
            <div ref={setNodeRef}
                className={`block p-2 m-2 flex-1 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md [background:${color}] relative`}
            >
                <div className="flex justify-between items-center">
                    <div className="font-bold">
                        Task Name
                    </div>
                    <div className={`py-1 px-2 m-1 rounded-lg border border-gray-200 shadow-md`}>
                        +
                    </div>
                </div>
                <hr />
                {items.map((id) => (
                    <SortableItem key={id} id={id} />
                ))}
            </div>
        </SortableContext>
    );
}


const defaultAnnouncements = {
    onDragStart(id) {
        console.log(`Picked up draggable item ${id}.`);
    },
    onDragOver(id, overId) {
        if (overId) {
            console.log(
                `Draggable item ${id} was moved over droppable area ${overId}.`
            );
            return;
        }

        console.log(`Draggable item ${id} is no longer over a droppable area.`);
    },
    onDragEnd(id, overId) {
        if (overId) {
            console.log(
                `Draggable item ${id} was dropped over droppable area ${overId}`
            );
            return;
        }

        console.log(`Draggable item ${id} was dropped.`);
    },
    onDragCancel(id) {
        console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
    }
};

export default function TaskColumn() {
    const [items, setItems] = useState({
        root: ["1", "2", "3"],
        container1: ["4", "5", "6"],
        container2: ["7", "8", "9"],
        container3: []
    });
    const [activeId, setActiveId] = useState();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <div className="flex w-full">
            <DndContext
                announcements={defaultAnnouncements}
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Container id="root" items={items.root} color="green" />
                <Container id="container1" items={items.container1} color="red" />
                <Container id="container2" items={items.container2} color="blue" />
                <Container id="container3" items={items.container3} color="yellow" />
                <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
            </DndContext>
        </div>
    );

    function findContainer(id) {
        if (id in items) {
            return id;
        }

        return Object.keys(items).find((key) => items[key].includes(id));
    }

    function handleDragStart(event) {
        const { active } = event;
        const { id } = active;

        setActiveId(id);
    }

    function handleDragOver(event) {
        const { active, over, draggingRect } = event;
        const { id } = active;
        const { id: overId } = over;

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            // Find the indexes for the items
            const activeIndex = activeItems.indexOf(id);
            const overIndex = overItems.indexOf(overId);

            let newIndex;
            if (overId in prev) {
                // We're at the root droppable of a container
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem =
                    over &&
                    overIndex === overItems.length - 1 &&
                    draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

                const modifier = isBelowLastItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item !== active.id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        const { id } = active;
        const { id: overId } = over;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer !== overContainer
        ) {
            return;
        }

        const activeIndex = items[activeContainer].indexOf(active.id);
        const overIndex = items[overContainer].indexOf(overId);

        if (activeIndex !== overIndex) {
            setItems((items) => ({
                ...items,
                [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
            }));
        }

        setActiveId(null);
    }
}
