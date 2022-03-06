import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { useThemeState } from '../context/themeContext';

export default function NavBar() {
    const theme = useTheme();
    const { toggleColorMode } = useThemeState();

    return (
        <AppBar
            data-testid='NavBar'
            position="sticky"
            elevation={2}
            enableColorOnDark
            color='default'
            sx={{ backgroundColor: 'transparent', padding: '0px 5px' }}>

            <Toolbar disableGutters variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="h6"
                    noWrap
                    sx={{ width: '100%', position: 'absolute', justifyContent: 'space-around' }}
                >
                    Cryptocurrency Price Tracker
                </Typography>

                <Tooltip title={`Toggle ${theme.palette.mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
                    <IconButton sx={{ color: theme.palette.text.secondary }} onClick={() => toggleColorMode()} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Tooltip>

                <div>
                    <Tooltip title={`GitHub`}>
                        <IconButton href="https://github.com/evanigwilo" target="_blank" rel="noopener noreferrer"
                            sx={{ color: theme.palette.text.secondary }}
                            color="inherit">
                            <GitHubIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={`LinkedIn`}>
                        <IconButton href="https://www.linkedin.com/in/evanigwilo" target="_blank" rel="noopener noreferrer"
                            sx={{ color: theme.palette.text.secondary }}
                            color="inherit">
                            <LinkedInIcon />
                        </IconButton>
                    </Tooltip>
                </div >
            </Toolbar>

        </AppBar>
    );
}