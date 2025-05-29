import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const CustomSlider = React.forwardRef(({ className, value, onChange, min, max, step, ...props }, ref) => {
  const handleValueChange = (newValue) => {
    if (onChange) {
      onChange(newValue[0]);
    }
  };

  return (
      <SliderPrimitive.Root
          ref={ref}
          className={cn('relative flex w-full touch-none select-none items-center', className)}
          value={[value]}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          {...props}
      >
        <SliderPrimitive.Track className="slider-track relative h-2 w-full grow">
          <SliderPrimitive.Range className="slider-track-active absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
  );
});

CustomSlider.displayName = 'CustomSlider';

export { CustomSlider };