import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  FilterDefinition,
  FilterAggregation,
  FilterState,
} from '@/types/entity-config';

interface FilterPanelProps {
  filters: FilterDefinition[];
  filterAggregations: FilterAggregation[];
  selectedFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({
  filters,
  filterAggregations,
  selectedFilters,
  onFilterChange,
}: FilterPanelProps) {
  const handleFilterToggle = (field: string, value: any) => {
    const currentValues = selectedFilters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...selectedFilters,
      [field]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const clearFilter = (field: string) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[field];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce(
      (acc, values) => acc + (values?.length || 0),
      0
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {getSelectedCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all ({getSelectedCount()})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filters.map((filter) => {
          const aggregation = filterAggregations.find(
            (agg) => agg.field === filter.field
          );
          const selectedValues = selectedFilters[filter.field] || [];

          if (!aggregation || aggregation.options.length === 0) {
            return null;
          }

          return (
            <div key={filter.field}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-between h-auto min-h-[2rem] py-2"
                  >
                    <span className="text-xs font-normal truncate">
                      {filter.label}
                    </span>
                    {selectedValues.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 px-1.5 text-xs"
                      >
                        {selectedValues.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${filter.label.toLowerCase()}...`}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup>
                        {aggregation.options.map((option) => {
                          const isSelected = selectedValues.includes(
                            option.value
                          );

                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() =>
                                handleFilterToggle(filter.field, option.value)
                              }
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'opacity-50'
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-sm">{option.label}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {option.count}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedValues.map((value) => {
                    const option = aggregation.options.find(
                      (opt) => opt.value === value
                    );
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="text-xs h-6 px-2"
                      >
                        {option?.label || value}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
