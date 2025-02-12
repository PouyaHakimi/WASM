import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import StudentCourseMarkTable from '../components/StudentCourseMarkTable';
import MainDuckDBTable from '../components/ApiDuckDBTable';
import FakeDuckDBTable from '../components/FakeDuckDBTable';
import ApiServerReport from '../components/reports/ApiServerReport';
import WasmApiDuckDBReport from '../components/reports/WasmApiDuckDBReport';
import WasmFakeDuckDBReport from '../components/reports/WasmFakeDuckDbReport';
import MainHeader from '../components/headers/mainHeader';
import SpeedTest from '../components/GaugePointer';
import { useState } from 'react';
import QueryResult from '../components/queryResult';
import WasmQueryResult from '../components/wasmQueryResult';
import StreamWasmQueryResult from '../components/streamWasmQueryResult';
import WasmJsonStreamReport from '../components/reports/WasmJsonStreamReport';
import WasmJsonReport from '../components/reports/WasmJsonReport';
import JsonApiReport from '../components/reports/JsonApiReort';
const NAVIGATION = [

    {
        kind: 'header',
        title: 'Student Data',
    },
    {
        segment: 'API-Server-Data',
        title: 'API-Server Data',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'API-Server',
                title: 'API-Server',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    }, {
        segment: 'WASM-API-DuckDB',
        title: 'WASM-API-DuckDB Data',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'WASM-API-DuckDB',
                title: 'WASM-API-DuckDB',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    }, {
        segment: 'WASM-Fake-DuckDB',
        title: 'WASM-Fake-DuckDB Data',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'WASM-Fake-DuckDB',
                title: 'WASM-Fake-DuckDB',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    },
    {
        segment: 'API-Json',
        title: 'API-Json',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'API-Json',
                title: 'API-Json',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    },
    {
        segment: 'WASM-DuckDB-Json',
        title: 'WASM-DuckDB-Json',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'WASM-DuckDB-Json',
                title: 'WASM-DuckDB-Json',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    },
    {
        segment: 'WASM-Stream-DuckDB-Json',
        title: 'WASM-Stream-DuckDB-Json',
        icon: <LayersIcon />,
        children: [
            {
                segment: 'WASM-Stream-DuckDB-Json',
                title: 'WASM-Stream-DuckDB-Json',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'Report',
                title: 'Report',
                icon: <BarChartIcon />,
            },
        ],
    },

    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'Analytics',
    },
    {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,

    },


];


const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function useDemoRouter() {
    const [pathname, setPathname] = React.useState('/');

    const router = React.useMemo(() => ({
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(String(path)),
    }), [pathname]);

    return router;
}



// const Skeleton = styled('div')(({ theme, height }) => ({
//     backgroundColor: theme.palette.action.hover,
//     borderRadius: theme.shape.borderRadius,
//     height,
//     content: '" "',
// }));

export default function DashboardLayoutBasic(props) {


    const router = useDemoRouter();

    return (

        <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>

            {/* search && Header */}
            <MainHeader search={props.search} setSearch={props.setSearch} />

            <DashboardLayout>
                <PageContainer>


                    {router.pathname === '/API-Server-Data' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/API-Server-Data/API-Server' && (

                        <StudentCourseMarkTable
                            stdCourseMark={props.stdCourseMark}
                            setStdCourseMark={props.setStdCourseMark}
                            fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                            searchData={props.searchData}
                            setSearchData={props.setSearchData}
                            search={props.search}

                            maxSpeed={props.maxSpeed}
                            speed={props.speed}
                        />

                    )}


                    {router.pathname === '/API-Server-Data' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/API-Server-Data/Report' && (

                        <ApiServerReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd} />
                    )}
                    {router.pathname === '/WASM-API-DuckDB' && <div>WASM-API-DuckDB Report Page</div>}

                    {router.pathname === '/WASM-API-DuckDB/WASM-API-DuckDB' && (
                        <MainDuckDBTable
                            stdDuckDB={props.stdDuckDB}
                            setStdDuckDB={props.setStdDuckDB}
                            chartData={props.chartData}
                            mainDuckDB={props.mainDuckDB}
                            setMainDuckDB={props.setMainDuckDB}
                            fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                            search={props.search}
                            setSpeed={props.setSpeed}
                            setMaxSpeed={props.setMaxSpeed} />

                    )}
                    {router.pathname === '/WASM-API-DuckDB' && <div>WASM-API-DuckDB Data Overview</div>}
                    {router.pathname === '/WASM-API-DuckDB/Report' && (
                        <WasmApiDuckDBReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                            search={props.search} />

                    )}

                    {router.pathname === '/WASM-Fake-DuckDB' && <div>WASM-Fake-DuckDB Report Page</div>}

                    {router.pathname === '/WASM-Fake-DuckDB/WASM-Fake-DuckDB' && (
                        <FakeDuckDBTable
                            stdDuckDB={props.stdDuckDB}
                            setStdDuckDB={props.setStdDuckDB}
                            chartData={props.chartData}
                            setChartData={props.setChartData}
                            fakeDuckDB={props.fakeDuckDB}
                            setFakeDuckDB={props.setFakeDuckDB}
                            fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                            search={props.search} />

                    )}

                    {router.pathname === '/WASM-Fake-DuckDB' && <div>WASM-Fake-DuckDB Data Overview</div>}
                    {router.pathname === '/WASM-Fake-DuckDB/Report' && (
                        <WasmFakeDuckDBReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                            search={props.search} />

                    )}


                    {router.pathname === '/API-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/API-Json/Report' && (

                        <JsonApiReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd} 
                            query={props.query}
                            setQuery={props.setQuery}/>
                    )}


                    {router.pathname === '/API-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/API-Json/API-Json' && (

                        <QueryResult query={props.query} setQuery={props.setQuery} />

                    )}
                    {router.pathname === '/WASM-DuckDB-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/WASM-DuckDB-Json/WASM-DuckDB-Json' && (

                        <WasmQueryResult query={props.query} setQuery={props.setQuery} />

                    )}

                    {router.pathname === '/WASM-DuckDB-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/WASM-DuckDB-Json/Report' && (

                        <WasmJsonReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                        />
                    )}

                    {router.pathname === '/WASM-Stream-DuckDB-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/WASM-Stream-DuckDB-Json/WASM-Stream-DuckDB-Json' && (

                        <StreamWasmQueryResult query={props.query} setQuery={props.setQuery} />

                    )}
                    {router.pathname === '/WASM-Stream-DuckDB-Json' && <div>API-Server Data Overview</div>}
                    {router.pathname === '/WASM-Stream-DuckDB-Json/Report' && (

                        <WasmJsonStreamReport fullMarks={props.fullMarks}
                            setFullMarks={props.setFullMarks}
                            attendedStd={props.attendedStd}
                            setattendedStd={props.setattendedStd}
                        />
                    )}


                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}

