import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Settings2, Eye, EyeOff, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface ColumnSelectorProps {
  columns: ColumnDef<any, any>[];
  visibleColumns: string[];
  onVisibilityChange: (columnIds: string[]) => void;
  onOrderChange?: (columnIds: string[]) => void;
}

function SortableColumnItem({
  column,
  onToggle,
}: {
  column: ColumnConfig;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 rounded-md group"
    >
      <div
        {...attributes}
        {...listeners}
        className="notion-drag-handle cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Checkbox
        id={column.id}
        checked={column.visible}
        onCheckedChange={() => onToggle(column.id)}
        className="data-[state=checked]:bg-primary"
      />
      <Label
        htmlFor={column.id}
        className="flex-1 text-sm cursor-pointer select-none"
      >
        {column.label}
      </Label>
      {column.visible ? (
        <Eye className="h-4 w-4 text-muted-foreground" />
      ) : (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}

export function ColumnSelector({
  columns,
  visibleColumns,
  onVisibilityChange,
  onOrderChange,
}: ColumnSelectorProps) {
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>(() =>
    columns
      .filter((col) => col.id || (col as any).accessorKey)
      .map((col) => {
        const id = col.id || String((col as any).accessorKey);
        const header = typeof col.header === 'string' ? col.header : id;
        return {
          id,
          label: header,
          visible: visibleColumns.includes(id),
        };
      })
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumnConfigs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        if (onOrderChange) {
          onOrderChange(newOrder.map((item) => item.id));
        }

        return newOrder;
      });
    }
  };

  const handleToggle = (id: string) => {
    setColumnConfigs((prev) => {
      const updated = prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      );
      const visibleIds = updated.filter((col) => col.visible).map((col) => col.id);
      onVisibilityChange(visibleIds);
      return updated;
    });
  };

  const handleShowAll = () => {
    setColumnConfigs((prev) => {
      const updated = prev.map((col) => ({ ...col, visible: true }));
      onVisibilityChange(updated.map((col) => col.id));
      return updated;
    });
  };

  const handleHideAll = () => {
    setColumnConfigs((prev) => {
      const updated = prev.map((col) => ({ ...col, visible: false }));
      onVisibilityChange([]);
      return updated;
    });
  };

  const visibleCount = columnConfigs.filter((col) => col.visible).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">
            {visibleCount}/{columnConfigs.length} columns
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Customize columns</h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowAll}
                className="h-7 px-2 text-xs"
              >
                Show all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHideAll}
                className="h-7 px-2 text-xs"
              >
                Hide all
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag to reorder, click to show/hide
          </p>
        </div>

        <div className="p-2 max-h-96 overflow-y-auto notion-scrollbar">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columnConfigs.map((col) => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {columnConfigs.map((column) => (
                <SortableColumnItem
                  key={column.id}
                  column={column}
                  onToggle={handleToggle}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </PopoverContent>
    </Popover>
  );
}
