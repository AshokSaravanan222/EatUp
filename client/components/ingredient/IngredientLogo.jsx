import Additive from "./svg/Additive";
import Preservative from "./svg/Preservative";
import Chemical from "./svg/Chemical"
import Nutrient from "./svg/Nutrient"

const componentMapping = {
  preservative: Preservative,
  additive: Additive,
  nutrient: Nutrient,
  chemical: Chemical,
};

const IngredientLogo = ({ type, size}) => {
  const Component = componentMapping[type];
  return <>{Component ? <Component size={size}/> : null}</>;
};

export default IngredientLogo;