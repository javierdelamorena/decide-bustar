import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorrageAdater {

    static async getItem(key: string): Promise<string | null> {
        try {
            return AsyncStorage.getItem(key);

        } catch (e) {
            return null;
        }
    };
    static async setItem(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, value);

        } catch (error) {
            console.log(error)
            throw new Error('error al hasce el set item');

        }
    };
    static async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key)
        } catch (error) {
            console.log(error)
            throw new Error('error al borrar set item');
        }

    }

}