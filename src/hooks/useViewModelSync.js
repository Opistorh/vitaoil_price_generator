import { useEffect, useRef } from "react";

export default function useViewModelSync(rive, textValues, booleanInputs) {
  const boundRef = useRef(false);

  // Инициализация View Model
  useEffect(() => {
    if (!rive || boundRef.current) {
      console.log('Skip initialization:', { hasRive: !!rive, alreadyBound: boundRef.current });
      return;
    }

    console.log('Initializing View Model...');
    try {
      // Получаем View Model по имени
      const viewModel = rive.viewModelByName("View Model 1");
      if (!viewModel) {
        console.error('View Model "View Model 1" not found');
        return;
      }
      console.log('Found View Model:', viewModel);

      // Создаем экземпляр View Model
      const viewModelInstance = viewModel.defaultInstance();
      if (!viewModelInstance) {
        console.error('Failed to create View Model instance');
        return;
      }
      console.log('Created View Model instance:', viewModelInstance);

      // Привязываем экземпляр
      rive.bindViewModelInstance(viewModelInstance);
      boundRef.current = true;
      
      console.log('View Model instance successfully bound');
    } catch (error) {
      console.error('Error initializing View Model:', error);
    }
  }, [rive]);

  // Синхронизация булевых входов
  useEffect(() => {
    if (!rive?.viewModelInstance || !booleanInputs) {
      console.log('Skip boolean sync:', { 
        hasInstance: !!rive?.viewModelInstance, 
        hasInputs: !!booleanInputs 
      });
      return;
    }

    console.log('Setting boolean inputs:', booleanInputs);
    const vmi = rive.viewModelInstance;

    try {
      // Устанавливаем значения через Boolean properties
      const arrowsLeft = vmi.boolean("arrows_left");
      if (arrowsLeft) {
        console.log('Setting arrows_left to:', booleanInputs.arrows_left);
        arrowsLeft.value = booleanInputs.arrows_left;
      }

      const coffeePriceShow = vmi.boolean("coffee_price_show");
      if (coffeePriceShow) {
        console.log('Setting coffee_price_show to:', booleanInputs.coffee_price_show);
        coffeePriceShow.value = booleanInputs.coffee_price_show;
      }

      const gasPriceShow = vmi.boolean("gas_price_show");
      if (gasPriceShow) {
        console.log('Setting gas_price_show to:', booleanInputs.gas_price_show);
        gasPriceShow.value = booleanInputs.gas_price_show;
      }

      // Добавляем наблюдателей за изменениями
      arrowsLeft?.on && arrowsLeft.on((event) => {
        console.log('arrows_left changed:', event.data);
      });

      coffeePriceShow?.on && coffeePriceShow.on((event) => {
        console.log('coffee_price_show changed:', event.data);
      });

      gasPriceShow?.on && gasPriceShow.on((event) => {
        console.log('gas_price_show changed:', event.data);
      });

    } catch (error) {
      console.error('Error syncing boolean inputs:', error);
    }
  }, [rive, booleanInputs]);

  // Синхронизация текстовых значений
  useEffect(() => {
    if (!rive?.viewModelInstance || !textValues) {
      console.log('Skip text sync:', { 
        hasInstance: !!rive?.viewModelInstance, 
        hasValues: !!textValues 
      });
      return;
    }

    try {
      const vmi = rive.viewModelInstance;
      
      Object.entries(textValues).forEach(([key, value]) => {
        const textProperty = vmi.text(key);
        if (textProperty) {
          console.log(`Setting text ${key} to:`, value);
          textProperty.value = value;
        }
      });
    } catch (error) {
      console.error('Error syncing text values:', error);
    }
  }, [rive, textValues]);
}
