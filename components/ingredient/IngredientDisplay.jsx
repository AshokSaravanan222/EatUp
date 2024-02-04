import React from 'react'
import { Text, TouchableOpacity} from 'react-native'

import styles from './ingredientDisplay.style'

const IngredientDisplay = ({ingredient}) => {
  return (
    <Text style={styles.itemText}>{ingredient}</Text>
  )
}

export default IngredientDisplay;