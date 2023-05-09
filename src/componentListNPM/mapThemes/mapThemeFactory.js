import DefaultMap from "./default";
import LegatoMap from './legatoStudentList'
import OutreachMap from "./outreachList";
import DefaultTasksMap from "./defaultTasks";
import GridMap from "./gridMap";
import dreamMakerAssign from "./dreamMakerAssign";
class MapThemeFactory {
    operationsFactory; 

    factory ={
       default: DefaultMap.getMapTheme(),
       legatoMap: LegatoMap.getMapTheme(),
       outreachMap: OutreachMap.getMapTheme(),
       defaultTasks: DefaultTasksMap.getMapTheme(),
       gridMap: GridMap.getMapTheme(),
       dreamMakerAssign: dreamMakerAssign.getMapTheme()

    }

    registerComponents(register){
        this.factory[register.name]= register.component;
    }
    getMapThemeFactory(){
        return this.factory;
    }

   
}
export default MapThemeFactory;