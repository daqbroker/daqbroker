"""
See:
https://packaging.python.org/en/latest/distributing.html
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages
import os

here = os.path.abspath(os.path.dirname(__file__))

# Get the long description from the README file
with open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

if not os.path.isdir('pip'):
    os.mkdir('pip')

packageName = 'DAQBrokerClient'


setup(
    
    name=packageName,  # Required


    version='0.0.1b8',  # Required


    description='Client for the DAQBroker server application',  # Required


    long_description=long_description,  # Optional


    long_description_content_type='text/markdown',  # Optional (see note above)


    url='https://daqbroker.com',  # Optional

    # This should be your name or the name of the organization which owns the
    # project.
    author='daqbroker',  # Optional

    # This should be a valid email address corresponding to the author listed
    # above.
    author_email='support@daqbroker.com',  # Optional

    # Classifiers help users find your project by categorizing it.
    #
    # For a list of valid classifiers, see https://pypi.org/classifiers/
    classifiers=[  # Optional
        # How mature is this project? Common values are
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 4 - Beta',

        # Indicate who your project is intended for
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Intended Audience :: Information Technology',

        # Pick your license as you wish
        'License :: OSI Approved :: MIT License',

        # Specify the Python versions you support here. In particular, ensure
        # that you indicate whether you support Python 2, Python 3 or both.
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        
        #Specifying operating systems
        'Operating System :: POSIX :: Linux',
        'Operating System :: Microsoft :: Windows  '
    ],


    keywords='monitoring scientific instrument data',  # Optional

    # You can just specify package directories manually here if your project is
    # simple. Or you can use find_packages().
    #
    
    #
    #packages=['server'],  # Required


    py_modules=['daqbrokerClient','parsingFuncs','sync'],

    # This field lists other packages that your project depends on to run.
    # Any package you put here will be installed by pip when your project is
    # installed, so they must be valid existing projects.
    #
    # For an analysis of "install_requires" vs pip's requirements files see:
    # https://packaging.python.org/en/latest/requirements.html
    install_requires=[
        'ntplib',
        'psutil',
        'pyAesCrypt',
        'snowflake',
        'concurrent_log_handler',
        'numpy',
        'pyzmq',
        'concurrent_log_handler',
        'requests',
        'arrow'
    ],

    #package_dir = {'': 'pip'},
    
    project_urls={  # Optional
        'Bug Reports': 'https://github.com/daqbroker/daqbroker/issues',
        'Source': 'https://github.com/daqbroker/daqbroker',
    },
    #include_package_data=True,

    #packages=['daqbroker.server']  # Required
)