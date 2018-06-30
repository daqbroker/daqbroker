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



def package_files(directory):
    paths = []
    for (path, directories, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join('..', path, filename))
    return paths

folders = ['static','templates']
extra_files=[]

for folder in folders:
    extra_files.append(package_files(folder))

setup(
    
    name='DAQBroker',  # Required



    version='0.0.1b1',  # Required



    description='A scientific instrument monitoring framework',  # Required



    long_description=long_description,  # Optional



    long_description_content_type='text/markdown',  # Optional (see note above)


    url='https://daqbroker.com',  # Optional

    # This should be your name or the name of the organization which owns the
    # project.
    author='Antonio Dias',  # Optional

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
        'Framework :: Flask  ',
        'Topic :: Database :: Front-Ends  ',

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
    packages=find_packages(exclude=['contrib', 'docs', 'tests']),  # Required

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
        'asteval',
        'concurrent_log_handler',
        'flask',
        'sqlalchemy',
        'tornado',
        'numpy',
        'scipy',
        'concurrent_log_handler'
    ],  # Optional



    extras_require={  # Optional
        #'dev': ['check-manifest'],
        #'test': ['coverage'],
    },



    package_data={  # Optional
        '':extra_files,
    },

    # Although 'package_data' is the preferred approach, in some case you may
    # need to place data files outside of your packages. See:
    # http://docs.python.org/3.4/distutils/setupscript.html#installing-additional-files


    data_files=[],  # Optional



    entry_points={  # Optional
        #'console_scripts': [
        #    'sample=sample:main',
        #],
    },



    project_urls={  # Optional
        #Something must be here like the github and the documentation part of the main website
        
    },
    #'Documentation': 'https://daqbroker.com/doc/index.html',
    #'Github': 'something something dark side',
)