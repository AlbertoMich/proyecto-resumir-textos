import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ResumenComponent } from './resumen/resumen.component';
export const routes: Routes = [
    //{path: 'traductor', component: TraductorComponent},
    {path: 'login', component: LoginComponent},
    {path: 'resumen', component: ResumenComponent},
    
];