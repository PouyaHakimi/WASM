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




const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'orders',
        title: 'Orders',
        icon: <ShoppingCartIcon />,
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
        children: [
            {
                segment: 'sales',
                title: 'Sales',
                icon: <DescriptionIcon />,
            },
            {
                segment: 'traffic',
                title: 'Traffic',
                icon: <DescriptionIcon />,
            },
        ],
    },
    {
        segment: 'integrations',
        title: 'Integrations',
        icon: <LayersIcon />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Student Data',
    },
    {
      segment: 'API-Server',
      title: 'API Server Data',
      icon: <DescriptionIcon />,
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

function useDemoRouter(initialPath) {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path) => setPathname(String(path)),
        };
    }, [pathname]);

    return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));

export default function DashboardLayoutBasic(props) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    // Remove this const when copying and pasting into your project.
    const demoWindow = window ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <PageContainer>
                    {/* <StudentCourseMarkTable stdCourseMark={props.stdCourseMark} setStdCourseMark={props.setStdCourseMark} fullMarks={props.fullMarks} setFullMarks={props.setFullMarks} attendedStd={props.attendedStd} setattendedStd={props.setattendedStd} searchData={props.searchData} setSearchData={props.setSearchData} search={props.search} /> */}
                    {router.pathname === '/dashboard' && (
            <div>
              <h2>Welcome to the Dashboard</h2>
              {/* Add any default content for the dashboard here */}
            </div>
          )}
          {router.pathname === '/API-Server' && (
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
              SearchApiData={props.SearchApiData} 
              setSearchApiData={props.setSearchApiData}
            />
          )}
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}

