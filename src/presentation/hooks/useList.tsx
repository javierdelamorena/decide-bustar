import axios from "axios";
import { useEffect, useState } from "react";
import type { Lista } from "../interfaces";
const loadUsers = async () => {
    try {
        const { data } = await axios.get<Lista>('https://cuevas-de-ayllon.com/listaAnuncios')
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
export const useList = () => {


    const [anuncios, setAnuncios] = useState<Lista[]>([]);

    useEffect(() => {



        axios.get<Lista>('https://cuevas-de-ayllon.com/listaAnuncios').then(rep => console.log(rep))
        fetch('https://cuevas-de-ayllon.com/listaAnuncios')
            .then(response => response.json())
            .then(data => console.log(data));
    }, [])

}
