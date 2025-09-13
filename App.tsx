
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StackNavigator } from "./src/presentation/routes/StackNavigator";


export const App = () => (
  <NavigationContainer>



    <StackNavigator />

  </NavigationContainer>
)
